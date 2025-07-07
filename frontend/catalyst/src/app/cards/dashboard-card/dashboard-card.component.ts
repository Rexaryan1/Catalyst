import { Component, input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'dashboard-card',
  standalone: true,
  imports: [NgClass],
  templateUrl: './dashboard-card.component.html',
  styleUrl: './dashboard-card.component.scss'
})
export class DashboardCardComponent {
  color = input("bg-primary");
  title = input("");
  content = input("");
  backgroundColor = input("");
}
