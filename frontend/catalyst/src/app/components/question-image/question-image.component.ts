import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisplayManagerService } from '@services/display-manager/display-manager.service';
import { ImageZoomViewerComponent } from './image-zoom-viewer/image-zoom-viewer.component';

type ImageState = 'loading' | 'loaded' | 'error';

@Component({
  selector: 'app-question-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './question-image.component.html',
  styleUrl: './question-image.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionImageComponent implements OnChanges {
  @Input() url: string | null | undefined = null;
  @Input() alt = '';

  state: ImageState = 'loading';
  private retryCount = 0;

  constructor(private displayManager: DisplayManagerService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('url' in changes) {
      this.state = 'loading';
      this.retryCount = 0;
    }
  }

  // Appends a cache-busting param on retry so the <img> issues a fresh request
  // even though `url` itself hasn't changed (the browser would otherwise serve
  // the cached failure without re-attempting the network request).
  get displayUrl(): string | null {
    if (!this.url) return null;
    if (this.retryCount === 0) return this.url;
    const separator = this.url.includes('?') ? '&' : '?';
    return `${this.url}${separator}retry=${this.retryCount}`;
  }

  onLoad(): void {
    this.state = 'loaded';
  }

  onError(): void {
    this.state = 'error';
  }

  retry(): void {
    this.retryCount++;
    this.state = 'loading';
  }

  openZoom(): void {
    if (this.state !== 'loaded' || !this.url) return;
    this.displayManager.open(ImageZoomViewerComponent, {
      inputs: { url: this.url, alt: this.alt },
      backdropColor: 'rgba(0, 0, 0, 0.85)',
      maxWidth: '95vw',
    });
  }
}
