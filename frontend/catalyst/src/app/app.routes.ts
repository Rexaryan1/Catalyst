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
import { AboutPage } from "@pages/about-page/about-page";
import { Header } from "@components/header/header";
import { PingBoardComponent } from "@components/cards/ping-board/ping-board.component";
import { AboutHeroSection } from "@pages/about-page/about-hero-section/about-hero-section";
import { FooterSection } from "@pages/about-page/footer-section/footer-section";
import { FeaturesGridSection } from "@pages/about-page/features-grid-section/features-grid-section";

import { authGuard } from '@services/auth/auth.guard'
import {HeatmapSmall} from '@components/cards/heatmap-small/heatmap-small';
import {DonutChart} from "@pages/user-dashboard/donut-chart/donut-chart";



export const routes: Routes = [
  { path: '', redirectTo: '/landing', pathMatch: 'full' },
  { path: 'landing', component: AboutPage },
  { path: 'home', component: LandingPage, data: { title: '' }, canActivate: [authGuard] },
  { path: 'register', component: MainPage, data: { header: 'Home' } },
  { path: 'prompt', component: RoadmapWizardComponent, data: { header: 'Home' },canActivate: [authGuard] },
  { path: 'dashboard', component: UserDashboardComponent, data: { title: 'Your Learning, in Data' }, canActivate: [authGuard] },
  { path: 'userHome', component: UserProfileComponent, data: { header: 'Home' }, canActivate: [authGuard] },
  { path: 'roadmap-tracker', component: RoadmapTrackerComponent, data: { title: "Roadmaps You've built" }, canActivate: [authGuard] },
  { path: 'roadmap', component: RoadmapPageComponent, data: { title: "Let's get cracking!" }, canActivate: [authGuard] },
  { path: 'progress', component: ProgressDashboardComponent, data: { header: 'Home' }, canActivate: [authGuard] },
  
  
  // Preview for testing
  { path: 'preview', component: DonutChart, data: { header: 'Testing Notifications' } },

];
