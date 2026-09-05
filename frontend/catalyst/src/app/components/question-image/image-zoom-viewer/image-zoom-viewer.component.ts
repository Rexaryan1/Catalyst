import { ChangeDetectionStrategy, Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const DOUBLE_TAP_SCALE = 2.5;

interface PointerState {
  x: number;
  y: number;
}

@Component({
  selector: 'app-image-zoom-viewer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './image-zoom-viewer.component.html',
  styleUrl: './image-zoom-viewer.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageZoomViewerComponent {
  @Input() url!: string;
  @Input() alt = '';

  @ViewChild('stage') stageRef!: ElementRef<HTMLDivElement>;

  scale = MIN_SCALE;
  translateX = 0;
  translateY = 0;

  private activePointers = new Map<number, PointerState>();
  private panStart: PointerState | null = null;
  private pinchStartDistance = 0;
  private pinchStartScale = MIN_SCALE;
  private lastTapAt = 0;

  get transform(): string {
    return `translate(${this.translateX}px, ${this.translateY}px) scale(${this.scale})`;
  }

  onPointerDown(event: PointerEvent): void {
    (event.target as HTMLElement).setPointerCapture(event.pointerId);
    this.activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (this.activePointers.size === 1) {
      this.panStart = { x: event.clientX - this.translateX, y: event.clientY - this.translateY };
    } else if (this.activePointers.size === 2) {
      this.pinchStartDistance = this.currentPointerDistance();
      this.pinchStartScale = this.scale;
    }
  }

  onPointerMove(event: PointerEvent): void {
    if (!this.activePointers.has(event.pointerId)) return;
    this.activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (this.activePointers.size === 2) {
      const distance = this.currentPointerDistance();
      if (this.pinchStartDistance > 0) {
        const nextScale = this.pinchStartScale * (distance / this.pinchStartDistance);
        this.setScale(nextScale);
      }
      return;
    }

    if (this.activePointers.size === 1 && this.panStart) {
      this.translateX = event.clientX - this.panStart.x;
      this.translateY = event.clientY - this.panStart.y;
      this.clampTranslation();
    }
  }

  onPointerUp(event: PointerEvent): void {
    this.activePointers.delete(event.pointerId);
    if (this.activePointers.size < 2) {
      this.pinchStartDistance = 0;
    }
    if (this.activePointers.size === 0) {
      this.panStart = null;
      this.handleTap();
    }
  }

  onWheel(event: WheelEvent): void {
    event.preventDefault();
    const delta = event.deltaY > 0 ? -0.2 : 0.2;
    this.setScale(this.scale + delta);
  }

  private handleTap(): void {
    const now = Date.now();
    if (now - this.lastTapAt < 300) {
      this.toggleZoom();
      this.lastTapAt = 0;
    } else {
      this.lastTapAt = now;
    }
  }

  private toggleZoom(): void {
    if (this.scale > MIN_SCALE) {
      this.setScale(MIN_SCALE);
      this.translateX = 0;
      this.translateY = 0;
    } else {
      this.setScale(DOUBLE_TAP_SCALE);
    }
  }

  private setScale(next: number): void {
    this.scale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, next));
    if (this.scale === MIN_SCALE) {
      this.translateX = 0;
      this.translateY = 0;
    }
    this.clampTranslation();
  }

  private clampTranslation(): void {
    const stage = this.stageRef?.nativeElement;
    if (!stage) return;
    const maxOffsetX = (stage.clientWidth * (this.scale - 1)) / 2;
    const maxOffsetY = (stage.clientHeight * (this.scale - 1)) / 2;
    this.translateX = Math.min(maxOffsetX, Math.max(-maxOffsetX, this.translateX));
    this.translateY = Math.min(maxOffsetY, Math.max(-maxOffsetY, this.translateY));
  }

  private currentPointerDistance(): number {
    const points = Array.from(this.activePointers.values());
    if (points.length < 2) return 0;
    const [a, b] = points;
    return Math.hypot(b.x - a.x, b.y - a.y);
  }
}
