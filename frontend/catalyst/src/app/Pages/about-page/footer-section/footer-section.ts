import { Component, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SectionLines } from '@pages/about-page/section-lines/section-lines';
import {
  SubscriptionService,
  SubscribeResult,
} from './subscription.service';
import { AnimateOnScrollDirective } from '@app/directives/animate-on-scroll.directive';

type FormState = 'idle' | 'loading' | 'success' | 'already_subscribed' | 'error';

@Component({
  selector: 'app-footer-section',
  imports: [SectionLines, FormsModule, NgClass, AnimateOnScrollDirective],
  templateUrl: './footer-section.html',
  styleUrl: './footer-section.scss',
})
export class FooterSection {
  readonly rows = [0, 15, 85, 100];
  readonly cols = [4.6875, 95.3125];

  email = signal('');
  formState = signal<FormState>('idle');

  readonly toastMessages: Record<Exclude<FormState, 'idle' | 'loading'>, string> = {
    success: '🎉 You\'re subscribed! Thanks for joining.',
    already_subscribed: 'This email is already subscribed.',
    error: "You'll be added to the list soon. Stay tuned!",
  };

  constructor(private subscriptionService: SubscriptionService) {}

  get isLoading(): boolean {
    return this.formState() === 'loading';
  }

  get toastMessage(): string | null {
    const state = this.formState();
    if (state === 'idle' || state === 'loading') return null;
    return this.toastMessages[state];
  }

  get toastType(): 'success' | 'info' | 'error' | null {
    const state = this.formState();
    if (state === 'success') return 'success';
    if (state === 'already_subscribed') return 'info';
    if (state === 'error') return 'error';
    return null;
  }

  isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }

  onSubmit(): void {
    const emailValue = this.email().trim();

    if (!this.isValidEmail(emailValue)) {
      this.formState.set('error');
      this.scheduleReset();
      return;
    }

    this.formState.set('loading');

    this.subscriptionService.subscribe(emailValue).subscribe({
      next: (result: SubscribeResult) => {
        this.formState.set(result.status);
        if (result.status === 'success') {
          this.email.set('');
        }
        this.scheduleReset();
      },
      error: () => {
        this.formState.set('error');
        this.scheduleReset();
      },
    });
  }

  private scheduleReset(ms = 4000): void {
    setTimeout(() => this.formState.set('idle'), ms);
  }
}
