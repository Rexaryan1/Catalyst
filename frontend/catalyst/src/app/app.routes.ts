    import { NgModule } from '@angular/core';
    import { RouterModule, Routes } from '@angular/router';
    import { LoginPageComponent } from './login-page/login-page.component';
import { QuestionCardComponent } from './question-card/question-card.component';

export const routes: Routes = [
    {path: 'login', component: LoginPageComponent},
    {path: 'questionCard',component: QuestionCardComponent},
];
