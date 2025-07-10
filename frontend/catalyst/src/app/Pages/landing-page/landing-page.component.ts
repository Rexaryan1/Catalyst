import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardCardComponent } from '../../cards/dashboard-card/dashboard-card.component';
import { NavBarComponent } from "../../nav-bar/nav-bar.component";

@Component({
  selector: 'dashboard',
  standalone: true,
  imports: [DashboardCardComponent, NavBarComponent, CommonModule],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPage {

}

