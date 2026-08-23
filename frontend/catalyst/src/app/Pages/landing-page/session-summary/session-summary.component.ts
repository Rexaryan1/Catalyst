import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DataManagerService } from '@services/data-manager/data-manager.service';
import {
  CardState,
  Enrollment,
  FocusArea,
  SessionData,
} from '@pages/session-home-page/session-home-page.component';

interface TileCard {
  enrollment: Enrollment;
  cardState: CardState;
  session: SessionData | null;
  pollCount: number;
}

type TileState = 'loading' | 'empty' | 'error' | 'ready';

const MAX_POLL_RETRIES = 2;
const POLL_INTERVAL_MS = 3000;

@Component({
  selector: 'app-session-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './session-summary.component.html',
  styleUrl: './session-summary.component.scss',
})
export class SessionSummaryComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @ViewChild('scroller') private scrollerRef?: ElementRef<HTMLElement>;

  state: TileState = 'loading';
  cards: TileCard[] = [];
  activeIndex = 0;

  constructor(
    private dataManager: DataManagerService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadEnrollments();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadEnrollments(): void {
    this.state = 'loading';
    this.dataManager
      .get<Enrollment[]>('api/enrollments/list', { withCredentials: true })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (enrollments) => {
          const list = enrollments ?? [];
          if (list.length === 0) {
            this.state = 'empty';
            return;
          }
          this.cards = list.map((e) => ({
            enrollment: e,
            cardState: 'loading' as CardState,
            session: null,
            pollCount: 0,
          }));
          this.state = 'ready';
          this.cards.forEach((_, i) => this.fetchSession(i));
        },
        error: () => {
          this.state = 'error';
        },
      });
  }

  retry(i: number): void {
    this.cards[i] = { ...this.cards[i], cardState: 'loading', pollCount: 0 };
    this.fetchSession(i);
  }

  private fetchSession(i: number): void {
    const id = this.cards[i].enrollment.id;
    this.dataManager
      .get<any>(`api/sessions/today?enrollment_id=${id}`, { withCredentials: true })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res?.status === 'preparing') {
            this.cards[i] = { ...this.cards[i], cardState: 'preparing' };
            this.schedulePoll(i);
          } else {
            this.applySessionState(i, res);
          }
        },
        error: () => {
          this.cards[i] = { ...this.cards[i], cardState: 'session_error' };
        },
      });
  }

  private schedulePoll(i: number): void {
    if (this.cards[i].pollCount >= MAX_POLL_RETRIES) return;
    timer(POLL_INTERVAL_MS)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.cards[i] = { ...this.cards[i], pollCount: this.cards[i].pollCount + 1 };
        this.fetchSession(i);
      });
  }

  private applySessionState(i: number, res: SessionData): void {
    const map: Record<string, CardState> = {
      READY: 'ready',
      IN_PROGRESS: 'in_progress',
      COMPLETED: 'completed',
    };
    this.cards[i] = {
      ...this.cards[i],
      cardState: map[res?.sessionStatus] ?? 'session_error',
      session: res,
    };
  }

  // A course can be added while under the 3-course cap — surfaced as the
  // trailing slide in the pager so it's always reachable, never in the way.
  get showAddSlide(): boolean {
    return this.cards.length > 0 && this.cards.length < 3;
  }

  get totalSlides(): number {
    return this.cards.length + (this.showAddSlide ? 1 : 0);
  }

  get slideIndexes(): number[] {
    return Array.from({ length: this.totalSlides }, (_, i) => i);
  }

  onScroll(): void {
    const el = this.scrollerRef?.nativeElement;
    if (!el || el.clientHeight === 0) return;
    const idx = Math.round(el.scrollTop / el.clientHeight);
    this.activeIndex = Math.max(0, Math.min(idx, this.totalSlides - 1));
  }

  goToSlide(i: number): void {
    const el = this.scrollerRef?.nativeElement;
    if (!el) return;
    el.scrollTo({ top: i * el.clientHeight, behavior: 'smooth' });
    this.activeIndex = i;
  }

  focusAreasFor(card: TileCard): FocusArea[] {
    return card.session?.focusAreas ?? [];
  }

  weekDots(card: TileCard): boolean[] {
    const wp = card.session?.weeklyProgress;
    if (!wp) return [];
    return Array.from({ length: wp.target }, (_, i) => i < wp.completed);
  }

  focusAccentClass(type: string): string {
    if (type === 'weakness') return 'stile-focus--weakness';
    if (type === 'review' || type === 'advance') return 'stile-focus--review';
    return 'stile-focus--new';
  }

  primaryLabel(card: TileCard): string {
    return card.cardState === 'in_progress' ? 'Resume session' : 'Start session';
  }

  openSession(i: number): void {
    const card = this.cards[i];
    if (!card.session) return;
    const sessionId = card.session.sessionId;
    this.dataManager.set('activeSession', { sessionId, enrollmentId: card.enrollment.id });
    this.dataManager
      .get<any>(`api/sessions/${sessionId}/questions`, { withCredentials: true })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.dataManager.set('sessionQuestions', res);
          this.router.navigate(['/sessions/quiz']);
        },
        error: () => this.router.navigate(['/sessions/quiz']),
      });
  }

  reviewSession(i: number): void {
    const card = this.cards[i];
    if (!card.session) return;
    const sessionId = card.session.sessionId;
    const cachedResult = this.dataManager.snapshot<any>('sessionResult');
    if (cachedResult?.session_id !== sessionId) {
      this.router.navigate(['/sessions']);
      return;
    }
    this.dataManager
      .get<any>(`api/sessions/${sessionId}/questions`, { withCredentials: true })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.dataManager.set('sessionQuestions', res);
          this.dataManager.set('sessionQuestionResults', cachedResult.question_results ?? []);
          this.router.navigate(['/sessions/review']);
        },
        error: () => this.router.navigate(['/sessions/review']),
      });
  }

  goToSessions(): void {
    this.router.navigate(['/sessions']);
  }
}
