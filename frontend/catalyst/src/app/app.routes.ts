import { RouterModule, Routes } from '@angular/router';
import { UserProfileComponent } from './Pages/user-profile/user-profile.component';
import { LandingPage } from '@pages/landing-page/landing-page.component';
import { RoadmapPageComponent } from "@pages/roadmap-page/roadmap-page.component";
import { UserDashboardComponent } from "@pages/user-dashboard/user-dashboard.component";
import { RoadmapWizardComponent } from "@components/roadmap-wizard/roadmap-wizard.component";
import { MainPage } from "@pages/signup-page/signup-page";
import { RoadmapListComponent } from "@pages/roadmap-page/roadmap-list/roadmap-list.component";
//TODO : Chheck if this is requrired
import { SolutionPage } from "@pages/solution-page/solution-page";

import { RoadmapTrackerComponent } from './Pages/roadmap-tracker/roadmap-tracker';
import { ProgressDashboardComponent } from './Pages/reports/progress-dashboard';
import { StickyNav } from "@components/sticky-nav/sticky-nav";



export const routes: Routes = [
  { path: '', redirectTo: '/register', pathMatch: 'full' },
  { path: 'home', component: LandingPage },
  { path: 'register', component: MainPage },
  { path: 'prompt', component: RoadmapWizardComponent },
  { path: 'dashboard', component: UserDashboardComponent },
  { path: 'userHome', component: UserProfileComponent },
  { path: 'roadmap-tracker', component: RoadmapTrackerComponent },
  { path: 'roadmap', component: RoadmapPageComponent },
  { path: 'progress', component: ProgressDashboardComponent },

  // Preview for testing
  { path: 'preview', component: StickyNav },

];
