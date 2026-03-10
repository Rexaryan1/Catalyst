import {Component, computed, signal, OnDestroy, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {FormBuilder, Validators, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {CommonModule, NgIf, NgSwitchCase} from "@angular/common";
import {trigger, transition, style, animate, query, animateChild, group} from '@angular/animations';
import {RoadmapRequest} from "@components/roadmap-wizard/roadmap-types.interface";
import {Graphic1Component} from "@components/roadmap-wizard/graphic-1/graphic-1.component";
import {Graphic2Component} from "@components/roadmap-wizard/graphic-2/graphic-2.component";
import {Graphic3Component} from "@components/roadmap-wizard/graphic-3/graphic-3.component";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {DataManagerService} from '@services/data-manager/data-manager.service';
import {Router} from "@angular/router";
import {interval, Subject} from 'rxjs';
import {take, takeUntil} from 'rxjs/operators';
import {AnimationOptions, LottieComponent} from "ngx-lottie";
import {AnimationItem} from "lottie-web";


const LOADING_MESSAGES = [
  'Generating your learning path...',
  'Analysing your goals...',
  'Mapping out the best topics...',
  'Structuring your roadmap...',
  'Almost there, hang tight...',
  'Taking you to the practice area...',
];


@Component({
  selector: 'app-roadmap-wizard',
  templateUrl: './roadmap-wizard.component.html',
  styleUrls: ['./roadmap-wizard.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    NgSwitchCase, NgIf, CommonModule,
    Graphic1Component, Graphic2Component, Graphic3Component,
    ReactiveFormsModule, MatProgressBarModule, LottieComponent
  ],
  animations: [
    trigger('swapGraphic', [
      transition(':increment', [
        style({position: 'relative'}),
        query(':enter, :leave', [
          style({position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'})
        ], {optional: true}),
        query(':enter', [style({opacity: 0, transform: 'translateY(30px)'})], {optional: true}),
        query(':leave', [animate('250ms ease-in', style({
          opacity: 0,
          transform: 'translateY(-30px)'
        }))], {optional: true}),
        query(':enter', [animate('300ms 100ms ease-out', style({
          opacity: 1,
          transform: 'translateY(0)'
        }))], {optional: true}),
      ]),
      transition(':decrement', [
        style({position: 'relative'}),
        query(':enter, :leave', [
          style({position: 'absolute', top: 0, left: 0, width: '100%', height: '100%'})
        ], {optional: true}),
        query(':enter', [style({opacity: 0, transform: 'translateY(-30px)'})], {optional: true}),
        query(':leave', [animate('250ms ease-in', style({
          opacity: 0,
          transform: 'translateY(30px)'
        }))], {optional: true}),
        query(':enter', [animate('300ms 100ms ease-out', style({
          opacity: 1,
          transform: 'translateY(0)'
        }))], {optional: true}),
      ]),
    ]),
  ],
})
export class RoadmapWizardComponent implements OnDestroy {
  options: AnimationOptions = {
    path: '../../assets/animations/Loading Animation.json',
    autoplay: true,
    loop: true,
  }
  readonly totalSteps = 3;
  stepIndex = signal(0);
  isLoading = signal(false);
  //loadingFailed = signal(false);
  loadingError = signal<'rate_limit' | 'generic' | null>(null);
  loadingMessage = signal(LOADING_MESSAGES[0]);

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
    private router: Router
  ) {
  }

  get loadingFailed() {
    return this.loadingError() !== null;
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

  get canSave() {
    return this.stepIndex() === 3;
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
    interval(2000).pipe(
      take(5),
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.dataManagerService.get(`roadmap/job?job_id=${jobId}`, {withCredentials: true}).subscribe({
          next: (response: any) => {
            if (response.status === 'completed' || response.result) {
              completed = true;
              this.stopMessageCycle();
              this.isLoading.set(false);
              this.router.navigate(['/roadmap']);
            }
          },
          error: (err) => {
            this.stopMessageCycle();
            this.isLoading.set(false);
            const msg = err?.error?.error_msg ?? '';
            this.loadingError.set(msg.includes('individual rate limit breached') ? 'rate_limit' : 'generic');
          },
        });
      },
      complete: () => {
        if (!completed) {
          this.stopMessageCycle();
          this.isLoading.set(false);
          this.loadingError.set('generic');
        }
      }
    });
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
        additional_comments: formValues.intent
      };

      this.dataManagerService.post('roadmap/generate/', payload, {withCredentials: true}, "roadmap").subscribe({
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

}



