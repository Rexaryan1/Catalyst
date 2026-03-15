import { RouterModule, Routes } from '@angular/router';
import { UserProfileComponent } from './Pages/user-profile/user-profile.component';
import { LandingPage } from '@pages/landing-page/landing-page.component';
import { RoadmapPageComponent } from "@pages/roadmap-page/roadmap-page.component";
import { UserDashboardComponent } from "@pages/user-dashboard/user-dashboard.component";
import { RoadmapWizardComponent } from "@components/roadmap-wizard/roadmap-wizard.component";
import { MainPage } from "@pages/signup-page/signup-page";
import { RoadmapListComponent } from "@pages/roadmap-page/roadmap-list/roadmap-list.component";

import { RoadmapTrackerComponent } from './Pages/roadmap-tracker/roadmap-tracker';
import { ProgressDashboardComponent } from './Pages/reports/progress-dashboard';
import { StickyNav } from "@components/sticky-nav/sticky-nav";
import {AboutPage} from "@pages/about-page/about-page";
import {Header} from "@components/header/header";
import {PingBoardComponent} from "@components/cards/ping-board/ping-board.component";
import {AboutHeroSection} from "@pages/about-page/about-hero-section/about-hero-section";
import {FooterSection} from "@pages/about-page/footer-section/footer-section";
import {FeaturesGridSection} from "@pages/about-page/features-grid-section/features-grid-section";



export const routes: Routes = [
  { path: '', redirectTo: '/landing', pathMatch: 'full' },
  { path: '', redirectTo: '/landing', pathMatch: 'full' },
  { path: 'landing', component: AboutPage },
  { path: 'home', component: LandingPage , data: { header: 'Home' }},
  { path: 'register', component: MainPage, data: { header: 'Home' }},
  { path: 'prompt', component: RoadmapWizardComponent , data: { header: 'Home' }},
  { path: 'dashboard', component: UserDashboardComponent , data: { header: 'Home' }},
  { path: 'userHome', component: UserProfileComponent , data: { header: 'Home' }},
  { path: 'roadmap-tracker', component: RoadmapTrackerComponent , data: { header: 'Home' }},
  { path: 'roadmap', component: RoadmapPageComponent , data: { header: 'Home' } },
  { path: 'progress', component: ProgressDashboardComponent , data: { header: 'Home' } },

  // Preview for testing
  { path: 'preview', component: AboutPage, data: { header: 'Testing Notifications' } },

];
