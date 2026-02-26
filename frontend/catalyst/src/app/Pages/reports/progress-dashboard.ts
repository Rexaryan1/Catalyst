import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisplayManagerService } from '@services/display-manager/display-manager.service';
import { ComponentRef, EnvironmentInjector, ApplicationRef, Injectable, inject } from '@angular/core';
// Data Models
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
export class ProgressDashboardComponent {
  @Input() title: string = 'Your Progress, Decoded.';
  @Input() showDownloadButton: boolean = true;
  @Input() data: DashboardData = {
    accuracy: {
      percentage: 86,
      label: 'Accuracy',
      sublabel: 'Solid consistency, keep it up.'
    },
    progress: {
      percentage: 20,
      label: 'Progress',
      sublabel: 'Solved'
    },
    averageTime: {
      time: '14:06',
      label: 'Average Time',
      sublabel: 'Good balance of speed and thought.'
    },
    recentAttempts: {
      attempts: [
        { question: 'Force equals mass equals what?', date: '3/N/25', status: 'correct', time: '10:08h' },
        { question: 'Force equals mass equals what?', date: '3/N/25', status: 'correct', time: '10:08h' },
        { question: 'Force equals mass equals what?', date: '3/N/25', status: 'incorrect', time: '10:08h' }
      ]
    }
  };
  private ds = inject(DisplayManagerService);

  readonly radius = 58;

  downloadReport(): void {
    // Implement report download logic here

    this.ds.open(ProgressDashboardComponent, { data: this.data });
  }

  get circumference(): number {
    return 2 * Math.PI * this.radius;
  }

  get dashOffset(): number {
    const percentage = this.data.progress?.percentage || 0;
    return this.circumference - (percentage / 100) * this.circumference;
  }

  get strokeDashArray(): string {
    return `${this.circumference} ${this.circumference}`;
  }
}