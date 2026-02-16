import { Component } from '@angular/core';
import { HeatmapSmall } from '@components/cards/heatmap-small/heatmap-small';

// ... existing code ...

@Component({
  selector: 'landing-dashboard-card',
  standalone: true,
  imports: [HeatmapSmall],
  templateUrl: './landing-dashboard-card.component.html',
  styleUrl: './landing-dashboard-card.component.scss'
})
export class LandingDashboardCardComponent {
  // Intentionally empty: this card only hosts the heatmap UI.
}

