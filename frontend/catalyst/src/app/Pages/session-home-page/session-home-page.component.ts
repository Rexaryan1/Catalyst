import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DataManagerService } from '@services/data-manager/data-manager.service';

export interface Enrollment {
  id: string;
  course: string;
  status: string;
  created_at: string;
}

export interface Course {
  name: string;
  topics: string[];
}

export interface FocusArea {
  topicName: string;
  questionCount: number;
  type: 'weakness' | 'new' | 'advance' | 'review';
  accuracy: number | null;
}

export interface SessionData {
  sessionId: string;
  subject: string;
  topicHeadline: string;
  reason: string;
  questionCount: number;
  estimatedMinutes: number;
  bloomsRange: { min: number; max: number } | null;
  weeklyProgress: { completed: number; target: number } | null;
  focusAreas: FocusArea[];
  sessionStatus: 'READY' | 'IN_PROGRESS' | 'COMPLETED';
  isCompleted: boolean;
  completionAccuracy: number | null;
  completionQuestions: number | null;
  completionStreak: number | null;
  enrollment_id?: string;
}

export type CardState = 'loading' | 'ready' | 'in_progress' | 'completed' | 'preparing' | 'session_error';
export type ScreenState = 'loading' | 'empty' | 'enrolled' | 'error';

interface EnrollmentCard {
  enrollment: Enrollment;
  cardState: CardState;
  session: SessionData | null;
  pollCount: number;
  showManualRefresh: boolean;
}

const MAX_POLL_RETRIES = 2;
const POLL_INTERVAL_MS = 3000;

@Component({
  selector: 'app-session-home-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './session-home-page.component.html',
  styleUrl: './session-home-page.component.scss',
})
export class SessionHomePageComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  screenState = signal<ScreenState>('loading');
  cards: EnrollmentCard[] = [];
  enrollments: Enrollment[] = [];

  showCoursePicker = signal(false);
  enrolling = signal(false);
  enrollError = signal<'cap' | 'network' | 'already_enrolled' | null>(null);
  lastAttemptedCourse = signal<string | null>(null);

  availableCourses = signal<Course[]>([]);

  constructor(
    private dataManager: DataManagerService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadEnrollments();
    this.loadCourses();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadCourses(): void {
    this.dataManager
      .get<Course[]>('api/enrollments/courses', { withCredentials: true })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (courses) => this.availableCourses.set(courses ?? []),
        error: () => {},
      });
  }

  loadEnrollments(): void {
    this.screenState.set('loading');
    this.dataManager
      .get<Enrollment[]>('api/enrollments/list', { withCredentials: true })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (enrollments) => {
          this.enrollments = enrollments ?? [];
          if (this.enrollments.length === 0) {
            this.screenState.set('empty');
          } else {
            this.screenState.set('enrolled');
            this.buildCards();
          }
        },
        error: () => this.screenState.set('error'),
      });
  }

  private buildCards(): void {
    this.cards = this.enrollments.map((e) => ({
      enrollment: e,
      cardState: 'loading' as CardState,
      session: null,
      pollCount: 0,
      showManualRefresh: false,
    }));
    this.cards.forEach((_, i) => this.fetchSession(i));
  }

  private fetchSession(cardIndex: number): void {
    const id = this.cards[cardIndex].enrollment.id;
    this.dataManager
      .get<any>(`api/sessions/today?enrollment_id=${id}`, { withCredentials: true })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          if (res?.status === 'preparing') {
            this.cards[cardIndex] = { ...this.cards[cardIndex], cardState: 'preparing' };
            this.schedulePoll(cardIndex);
          } else {
            this.applySessionState(cardIndex, res);
          }
        },
        error: () => {
          this.cards[cardIndex] = { ...this.cards[cardIndex], cardState: 'session_error' };
        },
      });
  }

  private schedulePoll(cardIndex: number): void {
    if (this.cards[cardIndex].pollCount >= MAX_POLL_RETRIES) {
      this.cards[cardIndex] = { ...this.cards[cardIndex], showManualRefresh: true };
      return;
    }
    timer(POLL_INTERVAL_MS)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        const c = this.cards[cardIndex];
        this.cards[cardIndex] = { ...c, pollCount: c.pollCount + 1 };
        this.fetchSession(cardIndex);
      });
  }

  private applySessionState(cardIndex: number, res: SessionData): void {
    const map: Record<string, CardState> = {
      READY: 'ready',
      IN_PROGRESS: 'in_progress',
      COMPLETED: 'completed',
    };
    this.cards[cardIndex] = {
      ...this.cards[cardIndex],
      cardState: map[res?.sessionStatus] ?? 'session_error',
      session: res,
    };
  }

  weekDots(session: SessionData): boolean[] {
    if (!session?.weeklyProgress) return [];
    const { completed, target } = session.weeklyProgress;
    return Array.from({ length: target }, (_, i) => i < completed);
  }

  enrollInCourse(courseName: string): void {
    this.enrolling.set(true);
    this.enrollError.set(null);
    this.lastAttemptedCourse.set(courseName);
    this.dataManager
      .post<any>('api/enrollments/', { course: courseName }, { withCredentials: true })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.enrolling.set(false);
          this.showCoursePicker.set(false);
          this.loadEnrollments();
        },
        error: (err) => {
          this.enrolling.set(false);
          if (err?.status === 402) this.enrollError.set('cap');
          else if (err?.status === 409) this.enrollError.set('already_enrolled');
          else this.enrollError.set('network');
        },
      });
  }

  topicsPreview(topics: string[]): string {
    const shown = topics.slice(0, 3).join(', ');
    return topics.length > 3 ? `${shown}…` : shown;
  }

  openSession(cardIndex: number): void {
    const card = this.cards[cardIndex];
    if (!card.session) return;
    const sessionId = card.session.sessionId;
    this.dataManager.set('activeSession', {
      sessionId,
      enrollmentId: card.enrollment.id,
    });
    this.dataManager
      .get<any>(`api/sessions/${sessionId}/questions`, { withCredentials: true })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          console.log('[quiz] questions response:', res);
          this.dataManager.set('sessionQuestions', res);
          this.router.navigate(['/sessions/quiz']);
        },
        error: (err) => {
          console.error('[quiz] failed to fetch questions:', err);
          this.router.navigate(['/sessions/quiz']);
        },
      });
  }

  retrySessionFetch(cardIndex: number): void {
    this.cards[cardIndex] = {
      ...this.cards[cardIndex],
      cardState: 'loading',
      pollCount: 0,
      showManualRefresh: false,
    };
    this.fetchSession(cardIndex);
  }

  get canAddCourse(): boolean {
    return this.enrollments.length < 3;
  }
}
