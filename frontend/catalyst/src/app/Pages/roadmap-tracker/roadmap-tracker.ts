import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataManagerService } from '@services/data-manager/data-manager.service';
// Difficulty Level Enum
export enum DifficultyLevel {
  EASY = 'EASY',
  MEDIUM = 'MEDIUM',
  HARD = 'HARD'
}

// Roadmap Interface
export interface Roadmap {
  id: number;
  title: string;
  date: string;
  summary: string;
  difficulty: DifficultyLevel;
  completion: number;
  keywords: string[];
}

@Component({
  selector: 'app-roadmap-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './roadmap-tracker.html',
  styleUrls: ['./roadmap-tracker.scss']
})
export class RoadmapTrackerComponent {
  constructor(private dataManager: DataManagerService) { }
  activeTab: string = 'in-progress';
  searchTerm: string = '';
  roadmaps: Roadmap[] = [];

  ngOnInit(): void {
    // Fetch roadmaps from backend API and populate the roadmaps array
    this.dataManager.post('/roadmap/roadmap-list', { "search": this.searchTerm, "filters": {} }, { withCredentials: true }).subscribe({
      next: (res: any) => {
        // Assuming the response is an array of roadmaps
        this.processResponse(res);
        // this.roadmaps = this.roadmaps.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      },
      error: (err) => {
        console.error('Error fetching roadmaps:', err);
      }
    });
  }

  private processResponse(res: any) {
    this.roadmaps = res.response.map((roadmap: any) => {

      if (roadmap.avg_difficulty === 'Easy') {
        roadmap.difficulty = DifficultyLevel.EASY;
      } else if (roadmap.avg_difficulty === 'Medium') {
        roadmap.difficulty = DifficultyLevel.MEDIUM;
      } else if (roadmap.avg_difficulty === 'Hard') {
        roadmap.difficulty = DifficultyLevel.HARD;
      }

      roadmap.progress_percntg = Math.round(roadmap.progress_percntg);

      return {
        id: roadmap.id,
        title: roadmap.title,
        date: roadmap.date,
        summary: roadmap.description,
        difficulty: roadmap.difficulty,
        completion: roadmap.progress_percntg,
        keywords: roadmap.preview_topics
      };
    });
  }

  onSearchChange(searchValue: string): void {
    this.dataManager.post('/roadmap/roadmap-list', { "search": searchValue, "filters": {} }, { withCredentials: true }).subscribe({
      next: (res: any) => {
        this.processResponse(res);
      },
      error: (err) => {
        console.error('Error fetching roadmaps:', err);
      }
    });
  }


  setActiveTab(tab: string): void {
    this.activeTab = tab;
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

