
import {
  Component, OnInit, OnDestroy,
  ElementRef, ViewChild, NgZone, ChangeDetectionStrategy
} from '@angular/core';

interface Blob {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  speed: number;
}

@Component({
  selector: 'app-hero-background',
  templateUrl: './hero-background.html',
  styleUrls: ['./hero-background.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class HeroBackground implements OnInit, OnDestroy {
  @ViewChild('blobEl', { static: true }) blobEl!: ElementRef<HTMLDivElement>;

  private blob: Blob = { x: 50, y: 80, targetX: 50, targetY: 80, speed: 0.008 };
  private rafId!: number;
  private pauseTimeout!: ReturnType<typeof setTimeout>;
  private isPaused = false;


  constructor(private ngZone: NgZone) {}

  ngOnInit(): void {
    // Run outside Angular zone — no change detection on every frame
    this.ngZone.runOutsideAngular(() => this.animate());
  }

  private animate(): void {
    if (!this.isPaused) {
      const b = this.blob;
      // Lerp toward target
      b.x += (b.targetX - b.x) * b.speed;
      b.y += (b.targetY - b.y) * b.speed;

      // Apply via CSS custom properties (no layout recalc)
      this.blobEl.nativeElement.style.setProperty('--x', `${b.x}%`);
      this.blobEl.nativeElement.style.setProperty('--y', `${b.y}%`);

      // Snap to target and pick a new one
      if (Math.abs(b.targetX - b.x) < 0.5 && Math.abs(b.targetY - b.y) < 0.5) {
        this.isPaused = true;
        // Dwell 1–3s at position, then move again
        this.pauseTimeout = setTimeout(() => {
          b.targetX = 20 + Math.random() * 60; // keep blob away from edges
          b.targetY = 40 + Math.random() * 50; // bias toward lower half like design
          b.speed = 0.004 + Math.random() * 0.008;
          this.isPaused = false;
        }, 1000 + Math.random() * 2000);
      }
    }

    this.rafId = requestAnimationFrame(() => this.animate());
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.rafId);
    clearTimeout(this.pauseTimeout);
  }
}
