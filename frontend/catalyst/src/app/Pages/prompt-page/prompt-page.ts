import {
  Component,
  computed,
  signal,
  OnDestroy,
  CUSTOM_ELEMENTS_SCHEMA,
  AfterViewInit,
} from '@angular/core';
import { FormBuilder, Validators, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgIf } from '@angular/common';
import { trigger, transition, style, animate, query } from '@angular/animations';
import { RoadmapRequest } from '@pages/prompt-page/roadmap-types.interface';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DataManagerService } from '@services/data-manager/data-manager.service';
import { Router } from '@angular/router';
import { interval, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { AnimationOptions, LottieComponent } from 'ngx-lottie';
import { AnimationItem } from 'lottie-web';
import {PingBoardComponent} from "@components/cards/ping-board/ping-board.component";

const LOADING_MESSAGES = [
  'Generating your learning path...',
  'Analysing your goals...',
  'Mapping out the best topics...',
  'Structuring your roadmap...',
  'Almost there, hang tight...',
  'Taking you to the practice area...',
];

// ── image paths – update to match your actual asset locations ──
const GRAPHICS = [
  'assets/prompt-images/graphic-1.svg',
  'assets/prompt-images/graphic-2.png',
  'assets/prompt-images/graphic-3.png',
];

@Component({
  selector: 'app-prompt-page',
  templateUrl: './prompt-page.html',
  styleUrls: ['./prompt-page.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [NgIf, CommonModule, ReactiveFormsModule, MatProgressBarModule, LottieComponent , PingBoardComponent],
  animations: [
    // Keep the right-panel step transition as a subtle fade+slide (no layout disruption)
    trigger('stepChange', [
      transition(':increment', [
        query(':enter', [style({ opacity: 0, transform: 'translateY(16px)' })], { optional: true }),
        query(':leave', [animate('180ms ease-in', style({ opacity: 0, transform: 'translateY(-12px)' }))], { optional: true }),
        query(':enter', [animate('240ms 80ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))], { optional: true }),
      ]),
      transition(':decrement', [
        query(':enter', [style({ opacity: 0, transform: 'translateY(-16px)' })], { optional: true }),
        query(':leave', [animate('180ms ease-in', style({ opacity: 0, transform: 'translateY(12px)' }))], { optional: true }),
        query(':enter', [animate('240ms 80ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))], { optional: true }),
      ]),
    ]),
  ],
})
export class PromptPage implements OnDestroy, AfterViewInit {
  options: AnimationOptions = {
    path: '../../assets/animations/Loading Animation.json',
    autoplay: true,
    loop: true,
  };

  readonly totalSteps = 3;
  readonly graphics = GRAPHICS;

  stepIndex = signal(0);
  isLoading = signal(false);
  loadingError = signal<'rate_limit' | 'generic' | null>(null);
  loadingMessage = signal(LOADING_MESSAGES[0]);

  /** Track which images have finished loading so we can show a skeleton until ready */
  imagesLoaded = signal<boolean[]>([false, false, false]);

  private destroy$ = new Subject<void>();
  private messageInterval: any;
  private messageIndex = 0;

  form: FormGroup = this.fb.group({
    subject: ['', [Validators.required, Validators.minLength(2)]],
    topic: ['', [Validators.required, Validators.minLength(2)]],
    intent: ['', [Validators.required]],
  });

  progress = computed(() => Math.round(((this.stepIndex() + 1) / this.totalSteps) * 100));

  showSubjectInput = signal(false);
  showTopicInput = signal(false);
  showIntentInput = signal(false);

  constructor(
    private fb: FormBuilder,
    private dataManagerService: DataManagerService,
    private router: Router,
  ) {}

  get loadingFailed() {
    return this.loadingError() !== null;
  }

  ngAfterViewInit(): void {
    // Eagerly preload all three graphics in JS so the browser fetches them immediately.
    // Once each image loads, mark it ready so the CSS transitions are instant.
    GRAPHICS.forEach((src, i) => {
      const img = new Image();
      img.onload = () => {
        this.imagesLoaded.update(arr => {
          const next = [...arr];
          next[i] = true;
          return next;
        });
      };
      img.src = src;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.stopMessageCycle();
  }

  animationCreated(animationItem: AnimationItem): void {
    console.log(animationItem);
  }

  get isLastStep() {
    return this.stepIndex() === this.totalSteps - 1;
  }

  next() {
    if (this.stepIndex() < this.totalSteps - 1) {
      this.stepIndex.update(i => i + 1);
    } else {
      this.submit();
    }
  }

  back() {
    if (this.stepIndex() > 0) this.stepIndex.update(i => i - 1);
  }

  private startMessageCycle(): void {
    this.messageIndex = 0;
    this.loadingMessage.set(LOADING_MESSAGES[0]);
    this.messageInterval = setInterval(() => {
      this.messageIndex = Math.min(this.messageIndex + 1, LOADING_MESSAGES.length - 1);
      this.loadingMessage.set(LOADING_MESSAGES[this.messageIndex]);
    }, 2200);
  }

  private stopMessageCycle(): void {
    if (this.messageInterval) {
      clearInterval(this.messageInterval);
      this.messageInterval = null;
    }
  }


  pollForJobCompletion(jobId: string): void {
    let completed = false;
    interval(6000)
      .pipe(take(5), takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.dataManagerService
            .get(`roadmap/job?job_id=${jobId}`, { withCredentials: true })
            .subscribe({
              next: (response: any) => {
                if (response.status === 'completed' || response.result) {
                  completed = true;
                  this.stopMessageCycle();
                  this.isLoading.set(false);
                  const roadmapData = response?.result ?? response;
                  const wrappedData = {
                    data: roadmapData
                  };

                  this.dataManagerService.set('roadmap', wrappedData);
                  this.router.navigate(['/roadmap']);
                }
              },
              error: (err) => {
                this.stopMessageCycle();
                this.isLoading.set(false);
                const msg = err?.error?.error_msg ?? '';
                this.loadingError.set(
                  msg.includes('individual rate limit breached') ? 'rate_limit' : 'generic',
                );
              },
            });
        },
        complete: () => {
          if (!completed) {
            this.stopMessageCycle();
            this.isLoading.set(false);
            this.loadingError.set('generic');
          }
        },
      });
  }

  dismissLoadingError(): void {
    this.loadingError.set(null);
  }

  submit() {
    if (this.form.valid) {
      this.isLoading.set(true);
      this.loadingError.set(null);
      this.startMessageCycle();

      const formValues = this.form.value;
      const payload: RoadmapRequest = {
        subject: formValues.subject,
        topic: formValues.topic,
        additional_comments: formValues.intent,
      };

      this.dataManagerService
        .post('roadmap/generate/', payload, { withCredentials: true }, 'roadmap')
        .subscribe({
          next: (response: any) => {
            const jobId = response.job_id;
            if (jobId) {
              this.pollForJobCompletion(jobId);
            } else {
              this.stopMessageCycle();
              this.isLoading.set(false);
              this.router.navigate(['/roadmap']);
            }
          },
          error: (err) => {
            this.stopMessageCycle();
            this.isLoading.set(false);
            const msg = err?.error?.error_msg ?? '';
            if (msg.includes('individual rate limit breached')) {
              this.loadingError.set('rate_limit');
            } else {
              this.loadingError.set('generic');
            }
          },
        });
    } else {
      this.form.markAllAsTouched();
    }
  }
  showNotifications = false;

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
  }

  //protected readonly NgIf = NgIf;
}
