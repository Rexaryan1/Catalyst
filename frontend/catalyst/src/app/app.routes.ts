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



export const routes: Routes = [
  { path: '', redirectTo: '/register', pathMatch: 'full' },
  { path: 'home', component: LandingPage , data: { title: '' }},
  { path: 'register', component: MainPage, data: { title: '' }},
  { path: 'prompt', component: RoadmapWizardComponent , data: { title: '' }},
  { path: 'dashboard', component: UserDashboardComponent , data: { title: 'Your progress, decoded.' }},
  { path: 'userHome', component: UserProfileComponent , data: { title: '' }},
  { path: 'roadmap-tracker', component: RoadmapTrackerComponent , data: { title: 'Roadmaps You’ve Built' }},
  { path: 'roadmap', component: RoadmapPageComponent , data: { title: 'Your roadmap is ready — let’s start cracking questions!' } },
  { path: 'progress', component: ProgressDashboardComponent , data: { title: '' } },

  // Preview for testing
  { path: 'preview', component: PingBoardComponent , data: { header: 'Testing Notifications' } },

];
