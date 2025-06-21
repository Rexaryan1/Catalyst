    import { NgModule } from '@angular/core';
    import { RouterModule, Routes } from '@angular/router';
    import { LoginPageComponent } from './login-page/login-page.component';
import { QuestionCardComponent } from './cards/question-card/question-card.component';

export const routes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'login', component: LoginPageComponent},
    {path: 'questionCard',component: QuestionCardComponent},
];
