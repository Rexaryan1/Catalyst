import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export type HeatmapDay = {
  date: string;  // YYYY-MM-DD
  count: number; // submissions that day
};

@Injectable({ providedIn: 'root' })
export class HeatmapService {
  private readonly mockUrl = 'assets/data/submission-heatmap.mock.json';

  constructor(private readonly http: HttpClient) {}

  getSubmissionHeatmap(days: number): Observable<HeatmapDay[]> {
    return this.http.get<HeatmapDay[]>(this.mockUrl).pipe(
      map((rows) =>
        [...rows]
          .sort((a, b) => a.date.localeCompare(b.date))
          .slice(-days)
      )
    );
  }
}
