import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from "@app/nav-bar/nav-bar.component";
import { TopicTag } from "./topic-tag/topic-tag";

@Component({
  selector: 'app-study-plan',
  standalone: true,
  imports: [
    CommonModule,
    TopicTag
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
