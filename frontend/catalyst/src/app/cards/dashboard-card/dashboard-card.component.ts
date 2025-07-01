import { Component, Input } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'dashboard-card',
  standalone: true,
  imports: [NgClass],
  templateUrl: './dashboard-card.component.html',
  styleUrl: './dashboard-card.component.scss'
})
export class DashboardCardComponent {
  @Input() color: any = "";
  @Input() title: any = "";
  @Input() content: any = "";
  @Input() backgroundColor: any = "";
}
