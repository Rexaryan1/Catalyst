import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './cards/login-page/login-page.component';
import { QuestionCardComponent } from './cards/question-card/question-card.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { LandingPage } from './landing-page/landing-page.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: LandingPage },
    { path: 'questionCard', component: QuestionCardComponent },
    { path: 'userHome', component: UserProfileComponent }
];
