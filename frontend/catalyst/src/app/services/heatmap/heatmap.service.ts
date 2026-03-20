import { Injectable } from '@angular/core';
import { Observable, of, map, tap } from 'rxjs';
import { DataManagerService } from '@services/data-manager/data-manager.service';

export type HeatmapDay = {
  date: string; // YYYY-MM-DD
  count: number;
};

type DashboardData = {
  heatmap: HeatmapDay[];
};

type DashboardApiResponse = {
  message: string;
  result: DashboardData;
};

@Injectable({ providedIn: 'root' })
export class HeatmapService {
  constructor(private readonly dataManager: DataManagerService) {}

  getSubmissionHeatmap(days: number): Observable<HeatmapDay[]> {
    const cachedHeatmap = this.dataManager.snapshot('dashboardHeatmap') as HeatmapDay[] | null;
    if (cachedHeatmap?.length) {
      return of(this.normalize(cachedHeatmap, days));
    }

    const cachedDashboard = this.dataManager.snapshot('dashboard') as DashboardData | null;
    if (cachedDashboard?.heatmap?.length) {
      this.dataManager.set('dashboardHeatmap', cachedDashboard.heatmap);
      return of(this.normalize(cachedDashboard.heatmap, days));
    }

    return this.dataManager.get('api/user/dashboard', { withCredentials: true }).pipe(
      map((response: DashboardApiResponse | any) => response?.result ?? null),
      tap((result: DashboardData | null) => {
        if (result) {
          this.dataManager.set('dashboard', result);
          this.dataManager.set('dashboardHeatmap', result.heatmap ?? []);
        }
      }),
      map((result: DashboardData | null) => this.normalize(result?.heatmap ?? [], days))
    );
  }

  private normalize(rows: HeatmapDay[], days: number): HeatmapDay[] {
    return [...rows]
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(-days);
  }
}
