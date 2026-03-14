import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about-hero-section',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './about-hero-section.html',
  styleUrl: './about-hero-section.scss',
})
export class AboutHeroSection implements AfterViewInit, OnDestroy{
 @ViewChild('copyFrame') copyFrame!: ElementRef<HTMLElement>;

  heroScrolled = false;

  frameTop = 0;
  frameBottom = 0;
  frameLeft = 0;
  frameRight = 0;

  private resizeObserver?: ResizeObserver;

  ngAfterViewInit(): void {
    this.updateFrameLines();

    this.resizeObserver = new ResizeObserver(() => {
      this.updateFrameLines();
    });

    this.resizeObserver.observe(this.copyFrame.nativeElement);
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.heroScrolled = window.scrollY > 24;
    this.updateFrameLines();
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    this.updateFrameLines();
  }

  scrollToDemo(): void {
    document.getElementById('demo')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }

  private updateFrameLines(): void {
    if (!this.copyFrame) return;

    const rect = this.copyFrame.nativeElement.getBoundingClientRect();

    this.frameTop = rect.top;
    this.frameBottom = window.innerHeight - rect.bottom;
    this.frameLeft = rect.left;
    this.frameRight = window.innerWidth - rect.right;
  }

}


