import { Component } from '@angular/core';
import { DashboardCardComponent } from '../cards/dashboard-card/dashboard-card.component';
import { NavBarComponent } from "../nav-bar/nav-bar.component";

@Component({
  selector: 'dashboard',
  standalone: true,
  imports: [DashboardCardComponent, NavBarComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class Dashboard {

}
