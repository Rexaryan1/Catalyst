import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription, timer } from 'rxjs';
import { DataManagerService } from '@services/data-manager/data-manager.service';
import { CodeSnippetComponent } from '@components/code-snippet/code-snippet.component';

// ── Interfaces ────────────────────────────────────────────────────────────────

export type QuestionType = 'mcq' | 'numerical';
export type QuizMode = 'live' | 'review';

// GET /sessions/{id}/questions — presentational only, no answer key.
// Neither MCQ nor numerical questions carry correct_index/correct_value/explanation
// at fetch time; that data only exists once the session has been submitted.
export interface RawQuestion {
  id: string;
  text: string;
  response_type: QuestionType;
  options?: string[];
  difficulty: string;
  bloom_level: number | null;
  tolerance?: number | string;
  isBookmarked: boolean;
  status: string;
  snippet_language: string | null;
  snippet_body: string | null;
  snippet_line_range: string | number[] | null;
  snippet_output: string | null;
}

export interface RawFocusArea {
  topicName: string;
  type: string;
  questions: RawQuestion[];
}

// POST /sessions/{id}/submit response — one entry per question, merged into
// FlatQuestion by question_id to drive review mode.
export interface QuestionResult {
  question_id: string;
  response_type: QuestionType;
  is_correct: boolean;
  skipped: boolean;
  selected_index?: number | null;
  correct_index?: number;
  submitted_value?: number | string | null;
  correct_value?: number | string;
  tolerance?: number | string;
  explanation?: string;
  distractor_explanations?: string;
}

export interface FlatQuestion extends RawQuestion {
  topicName: string;
  topicType: string;
  selectedIndex: number | null;
  selectedValue: number | null;
  answeredAt: string | null;
  timeTakenSeconds: number | null;
  // Populated only in review mode, from QuestionResult
  correct_index?: number;
  correct_value?: number;
  explanation?: string;
  distractor_explanations?: string;
  is_correct?: boolean;
  skipped?: boolean;
  // Live-mode interaction telemetry, persisted onto the question once answered
  timeToFirstTapMs: number | null;
  answerChanged: boolean;
}

export interface TopicSummary {
  topicName: string;
  type: string;
  total: number;
  firstFlatIndex: number;
}

export type PageState = 'loading' | 'quiz' | 'confirm' | 'submitting' | 'done' | 'error';
export type OptionState = 'default' | 'selected' | 'correct' | 'incorrect' | 'neutral';

// ── Component ──────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-session-quiz-page',
  standalone: true,
  imports: [CommonModule, FormsModule, CodeSnippetComponent],
  templateUrl: './session-quiz-page.component.html',
  styleUrl: './session-quiz-page.component.scss',
})
export class SessionQuizPageComponent implements OnInit, OnDestroy {

  // ── Page state
  pageState: PageState = 'loading';
  submitError = false;
  mode: QuizMode = 'live';

  // ── Question data
  questions: FlatQuestion[] = [];
  topicSummaries: TopicSummary[] = [];
  currentIndex = 0;

  // ── Per-question answer state (reset on navigation)
  selectedOption: number | null = null;
  numericAnswer: number | null = null;
  isSubmitted = false;
  isCorrect: boolean | null = null;
  elapsedSeconds = 0;

  // ── Session-level tracking
  private sessionStartedAt = '';

  // ── Per-question interaction telemetry (reset on navigation, live mode only)
  private questionStartedAt = 0;
  private firstInteractionAt: number | null = null;
  private changeCount = 0;

  // ── Timer
  private timerSub: Subscription | null = null;

  // ── Getters ───────────────────────────────────────────────────────────────────

  get current(): FlatQuestion | null {
    return this.questions[this.currentIndex] ?? null;
  }

  get isNumericalQuestion(): boolean {
    return this.current?.response_type === 'numerical';
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
    return this.questions.filter(q => this.isAnswered(q)).length;
  }

  get correctCount(): number {
    return this.questions.filter(q => this.isQuestionCorrect(q) === true).length;
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
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.mode = this.route.snapshot.data['mode'] === 'review' ? 'review' : 'live';
    if (this.mode === 'review') {
      this.initReview();
    } else {
      this.initLive();
    }
  }

  private initLive(): void {
    const raw = this.dataManager.snapshot<any>('sessionQuestions');

    if (!raw?.focusAreas?.length) {
      this.pageState = 'error';
      return;
    }

    this.sessionStartedAt = new Date().toISOString();
    this.buildQuestions(raw.focusAreas);
    this.pageState = 'quiz';
    this.beginQuestionTiming();
    this.startTimer();
  }

  private initReview(): void {
    const raw = this.dataManager.snapshot<any>('sessionQuestions');
    const results = this.dataManager.snapshot<QuestionResult[]>('sessionQuestionResults');

    if (!raw?.focusAreas?.length || !results?.length) {
      this.pageState = 'error';
      return;
    }

    this.buildQuestions(raw.focusAreas);
    this.applyReviewResults(results);
    this.currentIndex = 0;
    this.setIndex(0);
    this.pageState = 'quiz';
  }

  private applyReviewResults(results: QuestionResult[]): void {
    const byId = new Map(results.map(r => [r.question_id, r]));
    this.questions = this.questions.map(q => {
      const r = byId.get(q.id);
      if (!r) return q;
      return {
        ...q,
        selectedIndex: r.selected_index ?? null,
        selectedValue: r.submitted_value !== undefined && r.submitted_value !== null ? Number(r.submitted_value) : null,
        correct_index: r.correct_index,
        correct_value: r.correct_value !== undefined ? Number(r.correct_value) : undefined,
        tolerance: r.tolerance !== undefined ? Number(r.tolerance) : q.tolerance,
        explanation: r.explanation,
        distractor_explanations: r.distractor_explanations,
        is_correct: r.is_correct,
        skipped: r.skipped,
      };
    });
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
          selectedValue: null,
          answeredAt: null,
          timeTakenSeconds: null,
          timeToFirstTapMs: null,
          answerChanged: false,
        });
        flatIndex++;
      }
    }

    this.questions = flat;
    this.topicSummaries = summaries;
  }

  // ── Interaction ───────────────────────────────────────────────────────────────

  selectOption(i: number): void {
    if (this.mode !== 'live' || this.isSubmitted) return;
    this.trackInteraction(this.selectedOption !== i);
    this.selectedOption = i;
  }

  onNumericChange(value: number | null): void {
    if (this.mode !== 'live' || this.isSubmitted) return;
    this.trackInteraction(this.numericAnswer !== value);
    this.numericAnswer = value;
  }

  private trackInteraction(valueChanged: boolean): void {
    if (this.firstInteractionAt === null) {
      this.firstInteractionAt = Date.now();
    } else if (valueChanged) {
      this.changeCount++;
    }
  }

  private beginQuestionTiming(): void {
    this.questionStartedAt = Date.now();
    this.firstInteractionAt = null;
    this.changeCount = 0;
  }

  checkAnswer(): void {
    if (this.mode !== 'live' || this.isSubmitted || !this.current) return;
    const isNumerical = this.isNumericalQuestion;
    if (isNumerical) {
      if (this.numericAnswer === null || this.numericAnswer === undefined || Number.isNaN(this.numericAnswer)) return;
    } else {
      if (this.selectedOption === null) return;
    }

    this.stopTimer();
    this.isSubmitted = true;

    const updated: FlatQuestion = {
      ...this.current,
      selectedIndex: isNumerical ? null : this.selectedOption,
      selectedValue: isNumerical ? this.numericAnswer : null,
      answeredAt: new Date().toISOString(),
      timeTakenSeconds: this.elapsedSeconds,
      timeToFirstTapMs: this.firstInteractionAt !== null ? this.firstInteractionAt - this.questionStartedAt : null,
      answerChanged: this.changeCount > 0,
    };
    this.questions[this.currentIndex] = updated;
    this.questions = [...this.questions];
    // Live mode never reveals correctness — only the submit response does.
    this.isCorrect = this.isQuestionCorrect(updated);
  }

  // In live mode there is no answer key available client-side for either question
  // type, so this always returns null ("pending") until the session is submitted.
  // In review mode, correctness comes straight from the backend-computed is_correct.
  isQuestionCorrect(q: FlatQuestion): boolean | null {
    if (this.mode !== 'review') return null;
    return q.is_correct ?? null;
  }

  isAnswered(q: FlatQuestion): boolean {
    if (this.mode === 'review') return !q.skipped;
    return q.response_type === 'numerical' ? q.selectedValue !== null : q.selectedIndex !== null;
  }

  continue(): void {
    if (this.mode === 'review') {
      if (this.isLastQuestion) {
        this.goBack();
      } else {
        this.setIndex(this.currentIndex + 1);
      }
      return;
    }

    if (!this.isSubmitted) {
      this.checkAnswer();
    } else if (this.isLastQuestion) {
      this.finishSession();
    } else {
      this.setIndex(this.currentIndex + 1);
    }
  }

  finishSession(): void {
    if (this.mode !== 'live') return;
    if (this.answeredCount < this.questions.length) {
      this.pageState = 'confirm';
    } else {
      this.submitSession();
    }
  }

  confirmSubmit(): void {
    this.submitSession();
  }

  cancelConfirm(): void {
    this.pageState = 'quiz';
  }

  prev(): void {
    if (this.currentIndex > 0) this.setIndex(this.currentIndex - 1);
  }

  skip(): void {
    if (this.mode !== 'live') return;
    if (!this.isLastQuestion) this.setIndex(this.currentIndex + 1);
  }

  jumpToTopic(summary: TopicSummary): void {
    this.setIndex(summary.firstFlatIndex);
  }

  goBack(): void {
    this.router.navigate(['/sessions']);
  }

  retrySubmit(): void {
    this.submitError = false;
    this.submitSession();
  }

  private setIndex(i: number): void {
    const q = this.questions[i];
    if (!q) return;
    this.currentIndex = i;
    this.selectedOption = q.selectedIndex;
    this.numericAnswer = q.selectedValue;

    if (this.mode === 'review') {
      this.isSubmitted = true;
      this.isCorrect = this.isQuestionCorrect(q);
      return;
    }

    this.isSubmitted = this.isAnswered(q);
    this.isCorrect = this.isSubmitted ? this.isQuestionCorrect(q) : null;
    this.elapsedSeconds = 0;
    this.stopTimer();
    this.beginQuestionTiming();
    if (!this.isSubmitted) this.startTimer();
  }

  // ── Submit ────────────────────────────────────────────────────────────────────

  private submitSession(): void {
    const active = this.dataManager.snapshot<any>('activeSession');
    const sessionId = active?.sessionId;

    if (!sessionId) {
      this.pageState = 'done';
      return;
    }

    this.pageState = 'submitting';
    const payload = this.buildSubmitPayload();

    this.dataManager
      .post<any>(`api/sessions/${sessionId}/submit`, payload, { withCredentials: true })
      .subscribe({
        next: (res) => {
          this.dataManager.set('sessionResult', res);
          this.dataManager.set('sessionQuestionResults', res?.question_results ?? []);
          this.router.navigate(['/sessions/result']);
        },
        error: (err) => {
          if (err?.status === 409) {
            // Already submitted (e.g. double-tap) — navigate to result if we have data
            this.router.navigate(['/sessions/result']);
          } else {
            this.pageState = 'quiz';
            this.submitError = true;
          }
        },
      });
  }

  private buildSubmitPayload() {
    const focus_area_attempts = this.topicSummaries.map((s, _) => ({
      topic_name: s.topicName,
      topic_type: s.type,
      attempts: this.questions
        .slice(s.firstFlatIndex, s.firstFlatIndex + s.total)
        .map((q, j) => {
          const base = {
            question_id: q.id,
            time_to_first_tap_ms: q.timeToFirstTapMs ?? null,
            answer_changed: q.answerChanged,
            bloom_level: q.bloom_level,
            difficulty: q.difficulty,
            sequence_position: s.firstFlatIndex + j,
          };
          return q.response_type === 'numerical'
            ? { ...base, value: q.selectedValue ?? null }
            : { ...base, selected_index: q.selectedIndex ?? null };
        }),
    }));

    return {
      session_started_at: this.sessionStartedAt,
      device_timezone_offset_minutes: new Date().getTimezoneOffset() * -1,
      focus_area_attempts,
    };
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
    // Live mode has no answer key until the session is submitted — just show
    // what was picked, no correct/incorrect verdict. Only review mode (where
    // correct_index is merged in from the submit results) can color options.
    if (this.mode !== 'review') return i === this.selectedOption ? 'selected' : 'neutral';
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
      .filter(q => this.isAnswered(q)).length;
  }

  topicProgressPct(summary: TopicSummary): number {
    const answered = this.topicAnsweredCount(summary);
    return summary.total === 0 ? 0 : (answered / summary.total) * 100;
  }

  typeClasses(prefix: string, type: string): Record<string, boolean> {
    return {
      [`${prefix}--weakness`]: type === 'weakness',
      [`${prefix}--new`]:      type === 'new',
      [`${prefix}--advance`]:  type === 'advance',
      [`${prefix}--review`]:   type === 'review',
    };
  }
}
