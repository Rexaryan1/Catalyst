// app/roadmap/roadmap.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RoadmapRequest, RoadmapResponse } from './types';

@Injectable({ providedIn: 'root' })
export class RoadmapService {
  private baseUrl = 'https://catalyst-main-109334363006.asia-south2.run.app/roadmap/generate/';
  constructor(private http: HttpClient) {}
  createRoadmap(payload: RoadmapRequest): Observable<RoadmapResponse> {
    return this.http.post<RoadmapResponse>(`${this.baseUrl}`, payload);
  }
}
