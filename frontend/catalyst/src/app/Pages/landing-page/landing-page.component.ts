import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileSummaryComponent } from './profile-summary/profile-summary.component';
import { RoadmapCardComponent } from '@pages/landing-page/roadmap-card/roadmap-card.component';
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
    RoadmapCardComponent,
    OnboardingPopupComponent,
    QuickAccessComponent,
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
      description: 'Your AI-powered learning companion is ready to help you grow.',
    },
    {
      title: 'Available everywhere',
      description: 'Download the app on iOS or Android and learn on the go.',
    },
    {
      title: 'Your Roadmap',
      description: 'We build a personalised learning path based on your goals.',
    },
    {
      title: 'Your Dashboard',
      description: 'Track sessions, streaks, and progress all in one place.',
    },
    {
      title: 'Quick Access',
      description: 'Jump straight back into where you left off. That is it — you are all set!',
    },
    { title: 'Home', description: 'Jump back to your dashboard any time.' },
    { title: 'Explore', description: 'Browse topics and discover new learning paths.' },
    { title: 'Settings', description: 'Manage your profile, notifications, and preferences.' }
  ];

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
