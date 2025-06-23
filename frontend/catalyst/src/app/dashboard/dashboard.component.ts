import { Component } from '@angular/core';
import { DashboardCardComponent } from '../cards/dashboard-card/dashboard-card.component';

@Component({
  selector: 'dashboard',
  standalone: true,
  imports: [DashboardCardComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class Dashboard {

}
