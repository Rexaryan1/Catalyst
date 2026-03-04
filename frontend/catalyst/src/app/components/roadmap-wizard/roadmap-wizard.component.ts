import { Component, computed, signal, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgIf, NgSwitchCase } from "@angular/common";
import { RoadmapRequest } from "@components/roadmap-wizard/roadmap-types.interface";
import { Graphic1Component } from "@components/roadmap-wizard/graphic-1/graphic-1.component";
import { Graphic2Component } from "@components/roadmap-wizard/graphic-2/graphic-2.component";
import { Graphic3Component } from "@components/roadmap-wizard/graphic-3/graphic-3.component";
import { MatProgressBarModule } from "@angular/material/progress-bar";
import { DataManagerService } from '@services/data-manager/data-manager.service';
import { Router } from "@angular/router";
import { interval, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-roadmap-wizard',
  templateUrl: './roadmap-wizard.component.html',
  styleUrls: ['./roadmap-wizard.component.scss'],
  standalone: true,
  imports: [NgSwitchCase, NgIf, CommonModule, Graphic1Component, Graphic2Component, Graphic3Component, ReactiveFormsModule, MatProgressBarModule]
})
export class RoadmapWizardComponent {
  readonly totalSteps = 3;
  stepIndex = signal(0);
  isLoading = signal(false);
  private destroy$ = new Subject<void>();

  form: FormGroup = this.fb.group({
    subject: ['', [Validators.required, Validators.minLength(2)]],
    topic: ['', [Validators.required, Validators.minLength(2)]],
    intent: ['', [Validators.required]],
  });

  // 33 / 66 / 100
  progress = computed(() => Math.round(((this.stepIndex() + 1) / this.totalSteps) * 100));

  // UI toggles for showing inline inputs when the highlighted word is clicked
  showSubjectInput = signal(false);
  showTopicInput = signal(false);
  showIntentInput = signal(false);

  constructor(private fb: FormBuilder, private dataManagerService: DataManagerService, private router: Router) {

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


  // Poll for job completion every 2 seconds (max 5 times)
  pollForJobCompletion(jobId: string): void {
    console.log(`Starting to poll for job: ${jobId}`);
    interval(2000).pipe(
      take(5),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.dataManagerService.get(`roadmap/job?job_id=${jobId}`, { withCredentials: true }).subscribe({
        next: (response: any) => {
          console.log('Job status:', response);
          if (response.status === 'completed' || response.result) {
            console.log('Job completed:', response);
            this.isLoading.set(false);
            this.router.navigate(['/roadmap']);
          }
        },
        error: (err) => {
          console.error('Error polling job:', err);
          this.isLoading.set(false);
        },
      });
    });
  }

  submit() {
    if (this.form.valid) {
      this.isLoading.set(true);
      const formValues = this.form.value;
      const payload: RoadmapRequest = {
        subject: formValues.subject,
        topic: formValues.topic,
        additional_comments: formValues.intent
      };
      console.log('Submitting payload:', payload);
      console.log('Form values:', formValues);  // Also log raw form values for comparison

      this.dataManagerService.post('roadmap/generate/', payload, { withCredentials: true }, "roadmap").subscribe({
        next: (response: any) => {
          console.log('Roadmap created successfully:', response);
          const jobId = response.job_id;
          if (jobId) {
            this.pollForJobCompletion(jobId);
          } else {
            this.isLoading.set(false);
            this.router.navigate(['/roadmap']);
          }
        },
        error: (err) => {
          console.error('Error creating roadmap:', err);
          this.isLoading.set(false);
        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

}



