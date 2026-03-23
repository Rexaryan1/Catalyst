import { Component } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CdkDragEnd, DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-sticky-nav',
  standalone: true,
  imports: [CommonModule, RouterModule, DragDropModule],
  templateUrl: './sticky-nav.html',
  styleUrls: ['./sticky-nav.scss'],
})
export class StickyNav {
  isExpanded = false;
  isVisible = false;

  // Use pixels to avoid % math causing it to drift/disappear
  topPx = Math.round(window.innerHeight / 2);

  private readonly edgeMarginPx = 12;

  navItems = [
    { label: 'Dashboard', icon: 'assets/icons/dashboard-icon.svg', route: '/dashboard' },
    { label: 'Home', icon: 'assets/icons/home-icon.svg', route: '/home' },
    { label: 'Generate', icon: 'assets/icons/generate-icon.svg', route: '/prompt' },
    { label: 'Solve', icon: 'assets/icons/solve.svg', route: '/roadmap-tracker' },
  ];

  private readonly excludedRoutes = ['/register' , '/home' , '/preview', '/landing'];

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects || event.url;
        this.isVisible = !this.excludedRoutes.some(r => url.startsWith(r));
      }
    });
  }

  onDragEnded(event: CdkDragEnd): void {
    const element = event.source.element.nativeElement as HTMLElement;
    const rect = element.getBoundingClientRect();

    const viewportHeight = window.innerHeight;

    // If dragged too far, clamp it and effectively "stick" to the nearest corner (top-right or bottom-right).
    const minTop = this.edgeMarginPx;
    const maxTop = Math.max(minTop, viewportHeight - rect.height - this.edgeMarginPx);

    const desiredTop = rect.top;
    const clampedTop = Math.min(Math.max(minTop, desiredTop), maxTop);

    this.topPx = Math.round(clampedTop);

    // Remove CDK's translate so positioning is purely via fixed right + topPx
    event.source.reset();
  }
}
