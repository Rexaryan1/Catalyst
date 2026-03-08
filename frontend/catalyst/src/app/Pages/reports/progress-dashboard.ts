import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisplayManagerService } from '@services/display-manager/display-manager.service';
import { ComponentRef, EnvironmentInjector, ApplicationRef, Injectable, inject } from '@angular/core';
import { DataManagerService } from '@services/data-manager/data-manager.service';
// Server Response Models
export interface QuestionAttempt {
  selected_index: number;
  is_correct: boolean;
  answered_at: string;
}

export interface Question {
  question_id: string;
  selected_index: number;
  correct_index: number;
  question_text?: string;
  last_attempts: QuestionAttempt[];
}

export interface ServerProgressData {
  accuracy_pct: number;
  mean_time_seconds: number;
  roadmap_completion_pct: number;
  questions: Question[];
}

// Display Models
export interface ProgressData {
  percentage: number;
  label?: string;
  sublabel?: string;
}

export interface AccuracyData {
  percentage: number;
  label?: string;
  sublabel?: string;
}

export interface AverageTimeData {
  time: string;
  label?: string;
  sublabel?: string;
}

export interface AttemptData {
  question: string;
  date: string;
  status: 'correct' | 'incorrect';
  time?: string;
}

export interface RecentAttemptsData {
  attempts: AttemptData[];
}

export interface DashboardData {
  accuracy?: AccuracyData;
  progress?: ProgressData;
  averageTime?: AverageTimeData;
  recentAttempts?: RecentAttemptsData;
}

@Component({
  selector: 'app-progress-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-dashboard.html',
  styleUrls: ['./progress-dashboard.scss']
})
export class ProgressDashboardComponent implements OnInit {
  @Input() title: string = 'Your Progress, Decoded.';
  @Input() showDownloadButton: boolean = true;
  @Input() data?: ServerProgressData;

  displayData: DashboardData = {
    accuracy: {
      percentage: 0,
      label: 'Accuracy',
      sublabel: 'Solid consistency, keep it up.'
    },
    progress: {
      percentage: 0,
      label: 'Progress',
      sublabel: 'Solved'
    },
    averageTime: {
      time: '0:00',
      label: 'Average Time',
      sublabel: 'Good balance of speed and thought.'
    },
    recentAttempts: {
      attempts: []
    }
  };

  private ds = inject(DisplayManagerService);
  private dataManager = inject(DataManagerService);
  readonly radius = 58;

  ngOnInit(): void {
    if (this.data) {
      this.transformServerData(this.data);
    }
  }

  transformServerData(serverData: ServerProgressData): void {
    // Update accuracy
    if (this.displayData.accuracy) {
      this.displayData.accuracy.percentage = Math.round(serverData.accuracy_pct);
    }

    // Update progress
    if (this.displayData.progress) {
      this.displayData.progress.percentage = Math.round(serverData.roadmap_completion_pct);
    }

    // Convert mean_time_seconds to mm:ss format
    if (this.displayData.averageTime) {
      this.displayData.averageTime.time = this.secondsToTime(serverData.mean_time_seconds);
    }

    var fe_questions: any = this.dataManager.snapshot('roadmap');
    fe_questions = fe_questions.data.roadmapItems.flatMap((item: any) => item.questions);

    serverData.questions.forEach((serverQ) => {
      const feQ = fe_questions?.find((q: any) => q.id === serverQ.question_id);
      if (feQ) {
        serverQ.question_text = feQ.question_text;
      }
    });

    // Transform questions to recent attempts
    if (this.displayData.recentAttempts && serverData.questions.length > 0) {
      this.displayData.recentAttempts.attempts = serverData.questions.map((q, index) => {
        const lastAttempt = q.last_attempts[q.last_attempts.length - 1];
        return {
          question: q.question_text || `Question ${index + 1}`,
          date: this.formatDate(lastAttempt.answered_at),
          status: lastAttempt.is_correct ? 'correct' : 'incorrect',
          time: this.formatTime(lastAttempt.answered_at)
        };
      });
    }
  }

  private secondsToTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  private formatDate(dateString: string): string {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear().toString().slice(-2);
    return `${month}/${day}/${year}`;
  }

  private formatTime(dateString: string): string {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0');
    const mins = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${mins}h`;
  }

  downloadReport(): void {
    this.ds.open(ProgressDashboardComponent, { data: this.displayData });
  }

  get circumference(): number {
    return 2 * Math.PI * this.radius;
  }

  get dashOffset(): number {
    const percentage = this.displayData.progress?.percentage || 0;
    return this.circumference - (percentage / 100) * this.circumference;
  }

  get strokeDashArray(): string {
    return `${this.circumference} ${this.circumference}`;
  }
}