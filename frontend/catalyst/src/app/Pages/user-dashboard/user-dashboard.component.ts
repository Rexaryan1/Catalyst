import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from "@app/nav-bar/nav-bar.component";
import { TopicTag } from "./topic-tag/topic-tag";
import { DonutChart } from "./charts/donut-chart/donut-chart";

@Component({
  selector: 'app-study-plan',
  standalone: true,
  imports: [
    CommonModule,
    TopicTag,
    DonutChart
  ],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss'
})
export class UserDashboardComponent implements OnInit {
  strongZones: string[] = ['JavaScript', 'CSS', 'Angular'];

  ngOnInit() {
    // Initialization logic here
  }
}
