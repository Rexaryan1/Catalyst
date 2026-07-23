import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DataManagerService } from '@services/data-manager/data-manager.service';

interface TopicBreakdown {
  topic: string;
  correct: number;
  attempted: number;
  mastery: string;
  mastery_changed: boolean;
  previous_mastery: string;
}

interface WeeklyProgress {
  sessions_completed: number;
  weekly_accuracy: number;
  accuracy_delta_vs_last_week: number | null;
}

interface SessionSummary {
  total_questions: number;
  answered: number;
  correct: number;
  accuracy_rate: number;
  session_duration_seconds: number;
}

export interface SessionResult {
  status: string;
  session_id: string;
  summary: SessionSummary;
  topic_breakdown: TopicBreakdown[];
  weekly_progress: WeeklyProgress;
}

@Component({
  selector: 'app-session-result-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './session-result-page.component.html',
  styleUrl: './session-result-page.component.scss',
})
export class SessionResultPageComponent implements OnInit {
  result: SessionResult | null = null;
  hasData = false;

  constructor(
    private dataManager: DataManagerService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const res = this.dataManager.snapshot<SessionResult>('sessionResult');
    if (res) {
      this.result = res;
      this.hasData = true;
    }
  }

  get accuracyPct(): number {
    if (!this.result) return 0;
    return Math.round(this.result.summary.accuracy_rate * 100);
  }

  get incorrectCount(): number {
    if (!this.result) return 0;
    return this.result.summary.answered - this.result.summary.correct;
  }

  get skippedCount(): number {
    if (!this.result) return 0;
    return this.result.summary.total_questions - this.result.summary.answered;
  }

  get attemptedTopics(): TopicBreakdown[] {
    return (this.result?.topic_breakdown ?? []).filter(t => t.attempted > 0);
  }

  get changedMasteryTopics(): TopicBreakdown[] {
    return (this.result?.topic_breakdown ?? []).filter(t => t.mastery_changed);
  }

  get weeklyAccuracyPct(): number {
    return Math.round((this.result?.weekly_progress?.weekly_accuracy ?? 0) * 100);
  }

  get deltaVsLastWeek(): number | null {
    return this.result?.weekly_progress?.accuracy_delta_vs_last_week ?? null;
  }

  get formattedDuration(): string {
    const secs = this.result?.summary?.session_duration_seconds ?? 0;
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    if (m === 0) return `${s}s`;
    return s === 0 ? `${m}m` : `${m}m ${s}s`;
  }

  get deltaDisplay(): string {
    if (this.deltaVsLastWeek === null) return '';
    const pct = Math.round(this.deltaVsLastWeek * 100);
    return (pct > 0 ? '+' : '') + pct + '%';
  }

  masteryLabel(state: string): string {
    const labels: Record<string, string> = {
      new: 'New',
      developing: 'Developing',
      proficient: 'Proficient',
      weakness: 'Weakness',
    };
    return labels[state] ?? state;
  }

  goToSessions(): void {
    this.router.navigate(['/sessions']);
  }
}
