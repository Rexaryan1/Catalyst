import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  activeTab: string = 'in-progress';
  searchTerm: string = '';

  roadmaps: Roadmap[] = [
    {
      id: 1,
      title: '#ROADMAP 1',
      date: 'JAN 25 - 10:09PM',
      summary: 'Consectetur flatten the curve quaranteam so',
      difficulty: DifficultyLevel.EASY,
      completion: 26,
      keywords: ['keywords', 'keywords']
    },
    {
      id: 2,
      title: '#ROADMAP 2',
      date: 'JAN 25 - 10:09PM',
      summary: 'Consectetur flatten the curve quaranteam so',
      difficulty: DifficultyLevel.MEDIUM,
      completion: 36,
      keywords: ['keywords', 'keywords']
    },
    {
      id: 3,
      title: '#ROADMAP 1',
      date: 'JAN 25 - 10:09PM',
      summary: 'Consectetur flatten the curve quaranteam so',
      difficulty: DifficultyLevel.HARD,
      completion: 26,
      keywords: ['keywords']
    },
    {
      id: 4,
      title: '#ROADMAP 2',
      date: 'JAN 25 - 10:22PM',
      summary: 'Consectetur flatten the curve quaranteam so',
      difficulty: DifficultyLevel.EASY,
      completion: 26,
      keywords: ['keywords']
    },
    {
      id: 5,
      title: '#ROADMAP 1',
      date: 'JAN 25 - 10:22PM',
      summary: 'Consectetur flatten the curve quaranteam so',
      difficulty: DifficultyLevel.HARD,
      completion: 76,
      keywords: ['keywords', 'keywords']
    },
    {
      id: 6,
      title: '#ROADMAP 1',
      date: 'JAN 25 - 10:22PM',
      summary: 'Consectetur flatten the curve quaranteam so',
      difficulty: DifficultyLevel.MEDIUM,
      completion: 6,
      keywords: ['keywords', 'keywords']
    },
    {
      id: 3,
      title: '#ROADMAP 1',
      date: 'JAN 25 - 10:09PM',
      summary: 'Consectetur flatten the curve quaranteam so',
      difficulty: DifficultyLevel.HARD,
      completion: 26,
      keywords: ['keywords']
    },
    {
      id: 4,
      title: '#ROADMAP 2',
      date: 'JAN 25 - 10:22PM',
      summary: 'Consectetur flatten the curve quaranteam so',
      difficulty: DifficultyLevel.EASY,
      completion: 26,
      keywords: ['keywords']
    },
    {
      id: 5,
      title: '#ROADMAP 1',
      date: 'JAN 25 - 10:22PM',
      summary: 'Consectetur flatten the curve quaranteam so',
      difficulty: DifficultyLevel.HARD,
      completion: 76,
      keywords: ['keywords', 'keywords']
    },
  ];

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

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

