import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileSummaryComponent } from './profile-summary/profile-summary.component';
import { SessionSummaryComponent } from '@pages/landing-page/session-summary/session-summary.component';
import { LandingDashboardCardComponent } from '@pages/landing-page/landing-dashboard-card/landing-dashboard-card.component';
import { QuickAccessComponent } from '@pages/landing-page/quick-access/quick-access.component';
import { OnboardingPopupComponent, OnboardingStep } from './onboarding-popup/onboarding-popup.component';
import { DataManagerService } from '@services/data-manager/data-manager.service';

@Component({
  selector: 'dashboard',
  standalone: true,
  imports: [
    CommonModule,
    LandingDashboardCardComponent,
    ProfileSummaryComponent,
    SessionSummaryComponent,
    QuickAccessComponent,
    OnboardingPopupComponent,
  ],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPage {
  constructor(public dataManager: DataManagerService) { }

  // -1 means onboarding is finished / not active
  onboardingStep: number = -1;

  steps: OnboardingStep[] = [
    {
      title: 'Welcome!',
      description: 'Here\'s your session for today — pick up right where you left off.',
    },
    {
      title: 'Your Progress',
      description: 'Track your streaks and activity heatmap at a glance.',
    },
    {
      title: 'Your Profile',
      description: 'Streak, accuracy, and average time — tap to see your full profile.',
    },
  ];
  ngOnInit() {
    // Start onboarding if user is new
    this.dataManager.get('api/user/profile', { withCredentials: true }).subscribe({
      next: (response: any) => {
      },
      error: (error) => {
        console.error('Error checking if user is new:', error);
      }
    });
  }

  nextOnboardingStep(): void {
    if (this.onboardingStep < this.steps.length - 1) {
      this.onboardingStep++;
    } else {
      this.onboardingStep = -1; // all done — hides every popup
    }
  }

  prevOnboardingStep(): void {
    if (this.onboardingStep > 0) {
      this.onboardingStep--;
    }
  }
}
