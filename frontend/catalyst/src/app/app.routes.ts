import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './cards/login-page/login-page.component';
import { QuestionCardComponent } from './cards/question-card/question-card.component';
import { UserProfileComponent } from './Pages/user-profile/user-profile.component';
import { LandingPage } from '@pages/landing-page/landing-page.component';
import { PromptPageComponent } from '@pages/prompt-page/prompt-page.component';
import {StudyPlanComponent} from "@pages/study-plan/study-plan.component";
import {RoadmapPageComponent} from "@pages/roadmap-page/roadmap-page.component";

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: LandingPage },
    { path: 'prompt', component: PromptPageComponent },
    { path: 'questionCard', component: QuestionCardComponent },
    { path: 'userHome', component: UserProfileComponent },
    {path : 'plan' , component : StudyPlanComponent},
    {path : 'roadmap' , component: RoadmapPageComponent}

];
