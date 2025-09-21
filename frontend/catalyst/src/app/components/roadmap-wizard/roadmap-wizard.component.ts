import { Component, computed, signal } from '@angular/core';
import {FormBuilder, Validators, FormGroup, FormControl, ReactiveFormsModule} from '@angular/forms';
import {CommonModule, NgIf, NgSwitchCase} from "@angular/common";
import {RoadmapRequest} from "@components/roadmap-wizard/roadmap-types.interface";
import {Graphic1Component} from "@components/roadmap-wizard/graphic-1/graphic-1.component";
import {Graphic2Component} from "@components/roadmap-wizard/graphic-2/graphic-2.component";
import {Graphic3Component} from "@components/roadmap-wizard/graphic-3/graphic-3.component";
import {MatProgressBarModule} from "@angular/material/progress-bar";
import { DataManagerService } from '@services/data-manager/data-manager.service';

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

  constructor(private fb: FormBuilder, private dataManagerService: DataManagerService) {}

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

  submit() {
    //const payload: RoadmapRequest = this.form.getRawValue();
    // const payload: RoadmapRequest = {
    //   subject: this.subject,
    //   topic: this.topic,
    //   additional_comments: this.intent
    // };
    if (this.form.valid) {
      const formValues = this.form.value;
      const payload: RoadmapRequest = {
        subject: formValues.subject,
        topic: formValues.topic,
        additional_comments: formValues.intent
      };
      console.log('Submitting payload:', payload);
      console.log('Form values:', formValues);  // Also log raw form values for comparison


      // this.api.createRoadmap(payload).subscribe({
      //   next: (response) => {
      //     console.log('Roadmap created successfully:', response);
      //     // TODO: route to results page or render roadmap
      //     // console.log(resp);
      //   },
      //   error: (err) => {
      //     console.error('Error creating roadmap:', err);
      //     // TODO: toast/snackbar error
      //     // console.error(err);
      //   },
      // });
      this.dataManagerService.post('roadmap/generate', payload).subscribe({
        next: (response) => {
          console.log('Roadmap created successfully:', response);
        },
        error: (err) => {
          console.error('Error creating roadmap:', err);
        },
      });
    } else {
      this.form.markAllAsTouched();
    }
  }

}



