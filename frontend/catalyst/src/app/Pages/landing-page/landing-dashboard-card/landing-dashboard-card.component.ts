import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HeatmapSmall } from '@components/cards/heatmap-small/heatmap-small';

@Component({
  selector: 'landing-dashboard-card',
  standalone: true,
  imports: [HeatmapSmall],
  templateUrl: './landing-dashboard-card.component.html',
  styleUrl: './landing-dashboard-card.component.scss'
})
export class LandingDashboardCardComponent {
  constructor(private router: Router) {}

  openDashboard() {
    this.router.navigate(['/dashboard']);
  }
}

