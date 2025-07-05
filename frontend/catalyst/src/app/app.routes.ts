import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginPageComponent } from './login-page/login-page.component';
import { QuestionCardComponent } from './cards/question-card/question-card.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { Dashboard } from './landing-page/landing-page.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', component: Dashboard },
    { path: 'questionCard', component: QuestionCardComponent },
    { path: 'userHome', component: UserProfileComponent }
];
