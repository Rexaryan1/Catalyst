import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {DataManagerService} from '@services/data-manager/data-manager.service';
import {Router} from '@angular/router';
import {HttpParams} from '@angular/common/http';

// Difficulty Level Enum
export enum DifficultyLevel {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

// Roadmap Interface
export interface Roadmap {
  id: string; // UUID from backend
  title: string;
  date: string;
  summary: string;
  difficulty: DifficultyLevel;
  completion: number;
  keywords: string[];

  // used for loading the full roadmap on click
  roadmapId?: string | null;
}

type RoadmapListSort = { field: string; order: 'asc' | 'desc' };

@Component({
  selector: 'app-roadmap-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './roadmap-tracker.html',
  styleUrls: ['./roadmap-tracker.scss']
})
export class RoadmapTrackerComponent {
  constructor(
    private dataManager: DataManagerService,
    private router: Router
  ) {
  }

  activeTab: string = 'in-progress'; // tabs are currently commented out (kept for later)
  searchTerm: string = '';
  roadmaps: Roadmap[] = [];

  selectedDifficulty: 'Easy' | 'Medium' | 'Hard' | null = null;
  selectedSort: 'created_at_desc' | 'created_at_asc' = 'created_at_desc';

  limit = 6;
  offset = 0;

  ngOnInit(): void {
    this.fetchRoadmaps();
  }

  private fetchRoadmaps(): void {
    const filters: Record<string, any> = {};
    if (this.selectedDifficulty) {
      filters['difficulty'] = this.selectedDifficulty;
    }

    const sort: RoadmapListSort[] = [
      {
        field: 'created_at',
        order: this.selectedSort === 'created_at_desc' ? 'desc' : 'asc'
      }
    ];

    const payload = {
      search: this.searchTerm ?? '',
      filters,
      sort,
      limit: this.limit,
      offset: this.offset
    };

    this.dataManager
      .post('/roadmap/roadmap-list', payload, {withCredentials: true})
      .subscribe({
        next: (res: any) => {
          this.processResponse(res);
        },
        error: (err) => {
          console.error('Error fetching roadmaps:', err);
        }
      });
  }

  private processResponse(res: any) {
    this.roadmaps = (res?.response ?? []).map((roadmap: any) => {
      if (roadmap.avg_difficulty === 'Easy') {
        roadmap.difficulty = DifficultyLevel.EASY;
      } else if (roadmap.avg_difficulty === 'Medium') {
        roadmap.difficulty = DifficultyLevel.MEDIUM;
      } else if (roadmap.avg_difficulty === 'Hard') {
        roadmap.difficulty = DifficultyLevel.HARD;
      }

      roadmap.progress_percntg = Math.round(roadmap.progress_percntg);

      const uuid = roadmap.id; // backend UUIDField => "id"

      return {
        id: uuid,
        title: roadmap.title,
        date: roadmap.date,
        summary: roadmap.description,
        difficulty: roadmap.difficulty,
        completion: roadmap.progress_percntg,
        keywords: roadmap.preview_topics,

        // Use id as roadmap_id for GET /roadmap/get-roadmap?roadmap_id=...
        roadmapId: uuid
      };
    });
  }

  onSearchChange(event: string): void {
    const value = event ?? '';
    this.searchTerm = value;
    this.offset = 0;
    this.fetchRoadmaps();
  }

  onDifficultyChange(event: string): void {
    const value = event ?? '';
    this.selectedDifficulty = value ? (value as 'Easy' | 'Medium' | 'Hard') : null;
    this.offset = 0;
    this.fetchRoadmaps();
  }

  onSortChange(event: string): void {
    const value = event ?? 'created_at_desc';

    this.selectedSort = value as 'created_at_desc' | 'created_at_asc';
    this.offset = 0;
    this.fetchRoadmaps();
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  onRoadmapClick(roadmap: Roadmap): void {
    // Prefer roadmap.roadmapId, but fall back to roadmap.id since that's the UUID
    const roadmapId = roadmap?.roadmapId ?? roadmap?.id;

    if (!roadmapId) {
      console.error('Missing roadmap_id in roadmap list item:', roadmap);
      alert('This roadmap is missing roadmap_id from the list response.');
      return;
    }

    const params = new HttpParams().set('roadmap_id', roadmapId);

    this.dataManager
      .get('roadmap/get-roadmap', {withCredentials: true, params})
      .subscribe({
        next: (res: any) => {
          this.dataManager.set('roadmap', res);
          this.router.navigate(['/roadmap']);
        },
        error: (err) => {
          console.error('Error fetching full roadmap:', err);
        }
      });
  }

  //#region Helper Methods for Template

  getDifficultyColor(difficulty: DifficultyLevel): string {
    switch (difficulty) {
      case DifficultyLevel.EASY:
        return 'difficulty-easy';
      case DifficultyLevel.MEDIUM:
        return 'difficulty-medium';
      case DifficultyLevel.HARD:
        return 'difficulty-hard';
      default:
        return 'difficulty-default';
    }
  }

  getCircleStrokeDashoffset(completion: number): number {
    const circumference = 2 * Math.PI * 28;
    return circumference * (1 - completion / 100);
  }

  getCircumference(): number {
    return 2 * Math.PI * 28;
  }
}

