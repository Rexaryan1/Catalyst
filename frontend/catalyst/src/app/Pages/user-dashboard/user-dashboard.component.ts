import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from "@app/nav-bar/nav-bar.component";
import { TopicTag } from "./topic-tag/topic-tag";
import { DonutChart } from "./charts/donut-chart/donut-chart";
import { DataManagerService } from '@services/data-manager/data-manager.service';

export interface DashboardData {
  current_streak: number;
  max_streak: number;
  accuracy_pct: number;
  avg_time_seconds: number;
  difficulty_breakdown: { easy: number; medium: number; hard: number };
  heatmap: HeatmapEntry[];
}

export interface HeatmapEntry { date: string; count: number; }

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

  dashboard = signal<DashboardData | null>(null);
  isLoading = signal(true);
  hasError = signal(false);

  constructor(private dataManagerService: DataManagerService) {}

  ngOnInit(): void {
    const cached = this.dataManagerService.snapshot<DashboardData>('dashboard');
    if (cached) {
      console.log('Using cached dashboard data:', cached);
      this.dashboard.set(cached);
      this.isLoading.set(false);
      return;
    }
    this.dataManagerService.get('api/user/dashboard' , { withCredentials: true }).subscribe({
      next: (response: any) => {
        const result = response.result;
        // Store full dashboard stats under 'dashboard'
        this.dataManagerService.set('dashboard', result);
        console.log('Dashboard data:', result);
        // Store just the heatmap array under 'dashboardHeatmap'
        this.dataManagerService.set('dashboardHeatmap', result.heatmap);
        this.dashboard.set(result);
        this.isLoading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
    // Initialization logic here
  }
}
