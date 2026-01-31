import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-step-indicator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './stepper-small.html',
  styleUrls: ['./stepper-small.scss']
})
export class StepIndicatorComponent {
  @Input() totalSteps: number = 5;
  @Input() activeStep: number = 1;

  get steps(): number[] {
    return Array.from({ length: this.totalSteps }, (_, i) => i + 1);
  }
}