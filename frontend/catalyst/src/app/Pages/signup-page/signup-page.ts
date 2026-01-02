import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { DataManagerService } from "@services/data-manager/data-manager.service";
import { CommonModule } from "@angular/common";
import { SignupPage } from "./main-page/signup-page";
import { Goal } from './onboarding-pages/goal/goal';

@Component({
  selector: 'main-page',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    SignupPage,
    Goal
  ],
  templateUrl: './signup-page.html',
  styleUrl: './signup-page.scss',
  encapsulation: ViewEncapsulation.None  // disables encapsulation, making styles global
})

export class MainPage {
  step = 1;
  isLoginMode = false;
  signInForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  signUpForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl('')
  });

  constructor(private http: HttpClient, private router: Router, private dataManager: DataManagerService) { }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  next_page() {
    this.step += 1;
  }

}
