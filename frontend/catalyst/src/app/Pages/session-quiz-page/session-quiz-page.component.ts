import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { DataManagerService } from '@services/data-manager/data-manager.service';

// ── Interfaces ────────────────────────────────────────────────────────────────

export interface RawQuestion {
  id: string;
  text: string;
  options: string[];
  correct_index: number;
  difficulty: string;
  bloom_level: number | null;
  explanation: string;
  distractor_explanations: string;
  isBookmarked: boolean;
  status: string;
  snippet_language: string | null;
  snippet_body: string | null;
  snippet_line_range: string | null;
}

export interface RawFocusArea {
  topicName: string;
  type: string;
  questions: RawQuestion[];
}

export interface FlatQuestion extends RawQuestion {
  topicName: string;
  topicType: string;
  selectedIndex: number | null;
  answeredAt: string | null;
  timeTakenSeconds: number | null;
}

export interface TopicSummary {
  topicName: string;
  type: string;
  total: number;
  firstFlatIndex: number;
}

export type PageState = 'loading' | 'quiz' | 'done' | 'error';
export type OptionState = 'default' | 'selected' | 'correct' | 'incorrect' | 'neutral';

// ── Component ──────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-session-quiz-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './session-quiz-page.component.html',
  styleUrl: './session-quiz-page.component.scss',
})
export class SessionQuizPageComponent implements OnInit, OnDestroy {

  // ── Page state
  pageState: PageState = 'loading';

  // ── Question data
  questions: FlatQuestion[] = [];
  topicSummaries: TopicSummary[] = [];
  currentIndex = 0;

  // ── Per-question answer state (reset on navigation)
  selectedOption: number | null = null;
  isSubmitted = false;
  isCorrect: boolean | null = null;
  elapsedSeconds = 0;

  // ── Timer
  private timerSub: Subscription | null = null;

  // ── Getters ───────────────────────────────────────────────────────────────────

  get current(): FlatQuestion | null {
    return this.questions[this.currentIndex] ?? null;
  }

  get currentTopicType(): string {
    return this.current?.topicType ?? 'new';
  }

  get formattedTime(): string {
    const m = Math.floor(this.elapsedSeconds / 60);
    const s = this.elapsedSeconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }

  get answeredCount(): number {
    return this.questions.filter(q => q.selectedIndex !== null).length;
  }

  get correctCount(): number {
    return this.questions.filter(q => q.selectedIndex === q.correct_index).length;
  }

  get progressPct(): number {
    return this.questions.length === 0
      ? 0
      : (this.answeredCount / this.questions.length) * 100;
  }

  get accuracyPct(): number {
    return this.questions.length === 0 ? 0 : Math.round((this.correctCount / this.questions.length) * 100);
  }

  get isLastQuestion(): boolean {
    return this.currentIndex >= this.questions.length - 1;
  }

  // ── Lifecycle ─────────────────────────────────────────────────────────────────

  constructor(
    private dataManager: DataManagerService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const raw = this.dataManager.snapshot<any>('sessionQuestions');
    console.log('[quiz page] sessionQuestions:', raw);

    if (!raw?.focusAreas?.length) {
      this.pageState = 'error';
      return;
    }
    this.buildQuestions(raw.focusAreas);
    this.pageState = 'quiz';
    this.startTimer();
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  // ── Build flat question list ───────────────────────────────────────────────────

  private buildQuestions(focusAreas: RawFocusArea[]): void {
    let flatIndex = 0;
    const summaries: TopicSummary[] = [];
    const flat: FlatQuestion[] = [];

    for (const area of focusAreas) {
      summaries.push({
        topicName: area.topicName,
        type: area.type,
        total: area.questions.length,
        firstFlatIndex: flatIndex,
      });
      for (const q of area.questions) {
        flat.push({
          ...q,
          topicName: area.topicName,
          topicType: area.type,
          selectedIndex: null,
          answeredAt: null,
          timeTakenSeconds: null,
        });
        flatIndex++;
      }
    }

    this.questions = flat;
    this.topicSummaries = summaries;
  }

  // ── Interaction ───────────────────────────────────────────────────────────────

  selectOption(i: number): void {
    if (this.isSubmitted) return;
    this.selectedOption = i;
  }

  checkAnswer(): void {
    if (this.selectedOption === null || this.isSubmitted || !this.current) return;
    this.stopTimer();
    this.isSubmitted = true;
    this.isCorrect = this.selectedOption === this.current.correct_index;

    // persist answer on the flat question object
    this.questions[this.currentIndex] = {
      ...this.current,
      selectedIndex: this.selectedOption,
      answeredAt: new Date().toISOString(),
      timeTakenSeconds: this.elapsedSeconds,
    };
    this.questions = [...this.questions];
  }

  continue(): void {
    if (!this.isSubmitted) {
      this.checkAnswer();
    } else if (this.isLastQuestion) {
      this.pageState = 'done';
    } else {
      this.setIndex(this.currentIndex + 1);
    }
  }

  prev(): void {
    if (this.currentIndex > 0) this.setIndex(this.currentIndex - 1);
  }

  skip(): void {
    if (!this.isLastQuestion) this.setIndex(this.currentIndex + 1);
  }

  jumpToTopic(summary: TopicSummary): void {
    this.setIndex(summary.firstFlatIndex);
  }

  goBack(): void {
    this.router.navigate(['/preview']);
  }

  private setIndex(i: number): void {
    const q = this.questions[i];
    if (!q) return;
    this.currentIndex = i;
    this.selectedOption = q.selectedIndex;
    this.isSubmitted = q.selectedIndex !== null;
    this.isCorrect = this.isSubmitted ? q.selectedIndex === q.correct_index : null;
    this.elapsedSeconds = 0;
    this.stopTimer();
    if (!this.isSubmitted) this.startTimer();
  }

  // ── Timer ─────────────────────────────────────────────────────────────────────

  private startTimer(): void {
    this.timerSub = timer(1000, 1000).subscribe(() => { this.elapsedSeconds++; });
  }

  private stopTimer(): void {
    this.timerSub?.unsubscribe();
    this.timerSub = null;
  }

  // ── Option state ──────────────────────────────────────────────────────────────

  optionState(i: number): OptionState {
    if (!this.isSubmitted) return this.selectedOption === i ? 'selected' : 'default';
    if (i === this.current?.correct_index) return 'correct';
    if (i === this.selectedOption) return 'incorrect';
    return 'neutral';
  }

  optionLabel(i: number): string {
    return String.fromCharCode(65 + i);
  }

  // ── Topic panel helpers ────────────────────────────────────────────────────────

  isActiveTopic(summary: TopicSummary): boolean {
    return this.current?.topicName === summary.topicName;
  }

  topicAnsweredCount(summary: TopicSummary): number {
    return this.questions
      .slice(summary.firstFlatIndex, summary.firstFlatIndex + summary.total)
      .filter(q => q.selectedIndex !== null).length;
  }

  topicProgressPct(summary: TopicSummary): number {
    const answered = this.topicAnsweredCount(summary);
    return summary.total === 0 ? 0 : (answered / summary.total) * 100;
  }

  // Returns [class.X]=bool bindings for topic-type classes — keeps the template clean
  typeClasses(prefix: string, type: string): Record<string, boolean> {
    return {
      [`${prefix}--weakness`]: type === 'weakness',
      [`${prefix}--new`]:      type === 'new',
      [`${prefix}--advance`]:  type === 'advance',
      [`${prefix}--review`]:   type === 'review',
    };
  }
}
