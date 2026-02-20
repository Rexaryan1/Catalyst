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
  isVisible = true;

  // persisted "stick" position (percentage from top of viewport)
  topPosition = 50;

  navItems = [
    { label: 'Dashboard', icon: 'assets/icons/dashboard-icon.svg', route: '/dashboard' },
    { label: 'Home', icon: 'assets/icons/home-icon.svg', route: '/home' },
    { label: 'Generate', icon: 'assets/icons/generate-icon.svg', route: '/prompt' },
    { label: 'Solve', icon: 'assets/icons/solve.svg', route: '/roadmap' },
  ];

  excludedRoute = '/home';

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isVisible = !event.url.includes(this.excludedRoute);
      }
    });
  }

  onDragEnded(event: CdkDragEnd): void {
    const element = event.source.element.nativeElement as HTMLElement;
    const rect = element.getBoundingClientRect();

    const viewportHeight = window.innerHeight;

    // keep the whole nav within the viewport
    const maxTopPx = Math.max(0, viewportHeight - rect.height);
    const clampedTopPx = Math.min(Math.max(0, rect.top), maxTopPx);

    const maxPercent = maxTopPx === 0 ? 0 : (clampedTopPx / maxTopPx) * 100;
    this.topPosition = Math.max(0, Math.min(100, maxPercent));

    // remove CDK's translate so we're purely using [style.top.%] + right: 0
    event.source.reset();
  }
}
