import { Component } from '@angular/core';
import { DataManagerService } from '@services/data-manager/data-manager.service';
import { RoadmapListComponent } from "@pages/roadmap-page/roadmap-list/roadmap-list.component";
import { QuestionCard } from "@pages/roadmap-page/question-card/question-card";
import { Question } from "@components/cards/roadmap-item/roadmap-item.interface";
import { Subject, takeUntil } from 'rxjs';
import { RoadmapService } from "@pages/roadmap-page/roadmap-list/roadmap.service";

type AttemptDraft = {
  question_id: string;
  selected_index: number;
  answered_at: string;
  time_taken_seconds: number;
};

@Component({
  selector: 'app-roadmap-page',
  standalone: true,
  imports: [RoadmapListComponent, QuestionCard],
  templateUrl: './roadmap-page.component.html',
  styleUrl: './roadmap-page.component.scss'
})
export class RoadmapPageComponent {
  roadmapData: Object | null = null;

  activeBlockId: string | null = null; // block-001 etc (UI grouping only)
  activeQuestions: Question[] = [];
  activeIndex = 0;

  private destroy$ = new Subject<void>();

  private currentQuestionId: string | null = null;
  private currentQuestionStartedAtMs: number | null = null;
  private timeSpentSecondsByQuestionId = new Map<string, number>();

  private attemptsByQuestionId = new Map<string, AttemptDraft>();

  constructor(
    private dataManager: DataManagerService,
    private roadmapService: RoadmapService
  ) {}

  ngOnInit() {
    this.dataManager.select('roadmap').pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        if (data) this.roadmapData = data;
        else console.log('No roadmap data found');
      },
      error: (error) => {
        console.error('Error fetching roadmap data:', error);
      }
    });
  }

  ngOnDestroy(): void {
    this.flushTiming();
    this.destroy$.next();
    this.destroy$.complete();
  }

  onQuestionSelected(event: { roadmapId: string; questions: Question[]; index: number }): void {
    const isNewBlock = this.activeBlockId !== event.roadmapId;

    if (isNewBlock) {
      this.flushTiming();
      this.resetAttemptSession();
      this.activeBlockId = event.roadmapId;
    }

    this.activeQuestions = event.questions ?? [];
    this.setActiveIndex(event.index ?? 0);
  }

  onIndexChange(nextIndex: number): void {
    this.setActiveIndex(nextIndex);
  }

  onAnswered(e: { question_id: string; selected_index: number; answered_at: string }): void {
    const timeTakenSeconds = this.getTimeSpentSeconds(e.question_id);

    this.attemptsByQuestionId.set(e.question_id, {
      question_id: e.question_id,
      selected_index: e.selected_index,
      answered_at: e.answered_at,
      time_taken_seconds: timeTakenSeconds,
    });
  }

  submitForAnalysis(): void {
    const roadmapUuid = this.roadmapService.getRoadmapId();

    if (!roadmapUuid) {
      alert('Missing roadmap_id (UUID). Generate/select a roadmap again.');
      return;
    }

    this.flushTiming();

    const attempts: AttemptDraft[] = Array.from(this.attemptsByQuestionId.values());

    const payload = {
      roadmap_id: roadmapUuid,
      submitted_at: new Date().toISOString(),
      attempts,
    };

    this.dataManager.post<any>('practice/saveAttempts', payload).subscribe({
      next: (res) => {
        // Store full response so any component can use snapshot/select.
        this.dataManager.set('practiceReport', res);
        console.log('Submitted for analysis:', res);
      },
      error: (err) => {
        console.error('Submit failed:', err);
      }
    });
  }

  private setActiveIndex(nextIndex: number): void {
    if (!this.activeQuestions?.length) return;
    if (nextIndex < 0 || nextIndex >= this.activeQuestions.length) return;

    this.flushTiming();

    this.activeIndex = nextIndex;

    const q = this.activeQuestions[this.activeIndex];
    this.currentQuestionId = q?.id ?? null;
    this.currentQuestionStartedAtMs = this.currentQuestionId ? Date.now() : null;
  }

  private flushTiming(): void {
    if (!this.currentQuestionId || this.currentQuestionStartedAtMs === null) return;

    const elapsedSeconds = Math.max(
      0,
      Math.floor((Date.now() - this.currentQuestionStartedAtMs) / 1000)
    );

    const prev = this.timeSpentSecondsByQuestionId.get(this.currentQuestionId) ?? 0;
    this.timeSpentSecondsByQuestionId.set(this.currentQuestionId, prev + elapsedSeconds);

    this.currentQuestionStartedAtMs = null;
  }

  private getTimeSpentSeconds(questionId: string): number {
    const base = this.timeSpentSecondsByQuestionId.get(questionId) ?? 0;

    if (this.currentQuestionId === questionId && this.currentQuestionStartedAtMs !== null) {
      const running = Math.max(0, Math.floor((Date.now() - this.currentQuestionStartedAtMs) / 1000));
      return base + running;
    }

    return base;
  }

  private resetAttemptSession(): void {
    this.currentQuestionId = null;
    this.currentQuestionStartedAtMs = null;
    this.timeSpentSecondsByQuestionId = new Map<string, number>();
    this.attemptsByQuestionId = new Map<string, AttemptDraft>();
  }

  ngAfterViewInit() {}
}
