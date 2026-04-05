import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface OnboardingStep {
  title: string;
  description: string;
}

@Component({
  selector: 'app-onboarding-popup',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './onboarding-popup.component.html',
  styleUrls: ['./onboarding-popup.component.scss'],
})
export class OnboardingPopupComponent {

  /** The single step this instance displays. */
  @Input() step!: OnboardingStep;

  /** 0-based index of this step — used to render the progress bar. */
  @Input() stepIndex: number = 0;

  /** Total number of steps across the whole onboarding flow. */
  @Input() totalSteps: number = 1;

  /** Arrow position relative to the popup card. */
  @Input() arrowPosition: 'top' | 'bottom' = 'top';

  /** CSS left value for the arrow caret: '18px', '50%', 'center'. */
  @Input() arrowOffset: string = '18px';

  /** Width of the popup card. */
  @Input() width: string = '300px';
  /** Explicit CSS top value for the popup card e.g. '10px', 'auto' */
  @Input() top: string = '';

  /** Explicit CSS bottom value e.g. 'calc(100% + 10px)' */
  @Input() bottom: string = '';

  /** Explicit CSS left value for the popup card e.g. '0', '50%' */
  @Input() left: string = '';

  /** Explicit CSS right value e.g. '0', '20px' */
  @Input() right: string = '';

  /**
   * Fired when the user wants to move forward:
   *  - clicks Next / Done
   *  - clicks anywhere on the backdrop
   */
  @Output() advance = new EventEmitter<void>();

  /** Fired when the user clicks Back. */
  @Output() back = new EventEmitter<void>();

  get isFirst(): boolean { return this.stepIndex === 0; }
  get isLast():  boolean { return this.stepIndex === this.totalSteps - 1; }

  get dots(): number[] { return Array.from({ length: this.totalSteps }, (_, i) => i); }

  get arrowStyle(): Record<string, string> {
    if (this.arrowOffset === 'center') {
      return { left: '50%', transform: 'translateX(-50%)' };
    }
    return { left: this.arrowOffset, transform: '' };
  }

  get popupPositionStyle(): Record<string, string> {
    const style: Record<string, string> = {};
    if (this.top) style['top'] = this.top;
    if (this.bottom) style['bottom'] = this.bottom;
    if (this.left) style['left'] = this.left;
    if (this.right) style['right'] = this.right;
    return style;
  }
}
