import {Component, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TopicTag} from "./topic-tag/topic-tag";
import {DonutChart} from "./charts/donut-chart/donut-chart";
import {DataManagerService} from '@services/data-manager/data-manager.service';
import {Router} from '@angular/router';
import {HttpParams} from '@angular/common/http';
import {Roadmap, DifficultyLevel} from '@app/Pages/roadmap-tracker/roadmap-tracker';
import {HeatmapSmall} from '@components/cards/heatmap-small/heatmap-small';

export interface DashboardData {
  current_streak: number;
  max_streak: number;
  accuracy_pct: number;
  avg_time_seconds: number;
  difficulty_breakdown: { easy: number; medium: number; hard: number };
  heatmap: HeatmapEntry[];
}

export interface HeatmapEntry {
  date: string;
  count: number;
}

@Component({
  selector: 'app-study-plan',
  standalone: true,
  imports: [CommonModule, TopicTag, DonutChart, HeatmapSmall],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss'
})
export class UserDashboardComponent implements OnInit {
  isMonthDropdownOpen = false;

  currentMonthName = new Date().toLocaleString('default', {month: 'short'}).toUpperCase();

  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  strongZones: string[] = ['JavaScript', 'CSS', 'Angular'];

  dashboard = signal<DashboardData | null>(null);
  roadmaps = signal<Roadmap[]>([]);
  isLoading = signal(true);
  hasError = signal(false);

  constructor(
    private dataManagerService: DataManagerService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.loadDashboard();
    this.loadRoadmaps();
  }

  private loadDashboard(): void {
    const cached = this.dataManagerService.snapshot<DashboardData>('dashboard');
    if (cached) {
      this.dashboard.set(cached);
      this.isLoading.set(false);
      return;
    }
    this.dataManagerService.get('api/user/dashboard', {withCredentials: true}).subscribe({
      next: (response: any) => {
        const result = response.result;
        this.dataManagerService.set('dashboard', result);
        this.dataManagerService.set('dashboardHeatmap', result.heatmap);
        this.dashboard.set(result);
        this.isLoading.set(false);
      },
      error: () => {
        this.hasError.set(true);
        this.isLoading.set(false);
      }
    });
  }

  private loadRoadmaps(): void {
    const payload = {
      search: '',
      filters: {},
      sort: [{field: 'created_at', order: 'desc'}],
      limit: 5,
      offset: 0
    };
    this.dataManagerService.post<any>('/roadmap/roadmap-list', payload, {withCredentials: true})
      .subscribe({
        next: (res: any) => {
          this.roadmaps.set(
            (res?.response ?? []).map((r: any) => ({
              id: r.id,
              title: r.title,
              date: r.date,
              summary: r.description,
              difficulty: r.avg_difficulty?.toUpperCase() as DifficultyLevel,
              completion: Math.round(r.progress_percntg),
              keywords: r.preview_topics,
              roadmapId: r.id
            }))
          );
        },
        error: (err) => console.error('Error fetching roadmaps:', err)
      });
  }

  onRoadmapClick(roadmap: Roadmap): void {
    const roadmapId = roadmap.roadmapId ?? roadmap.id;
    if (!roadmapId) return;
    const params = new HttpParams().set('roadmap_id', roadmapId);
    this.dataManagerService.get('roadmap/get-roadmap', {withCredentials: true, params})
      .subscribe({
        next: (res: any) => {
          this.dataManagerService.set('roadmap', res);
          this.router.navigate(['/roadmap']);
        },
        error: (err) => console.error('Error fetching roadmap:', err)
      });
  }

  getCircleStrokeDashoffset(completion: number): number {
    return 2 * Math.PI * 28 * (1 - completion / 100);
  }

  getCircumference(): number {
    return 2 * Math.PI * 28;
  }
}
