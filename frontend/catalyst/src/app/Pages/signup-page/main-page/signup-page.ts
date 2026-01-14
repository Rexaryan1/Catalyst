import {Component, EventEmitter, Output} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {DataManagerService} from "@services/data-manager/data-manager.service";
import {CommonModule} from "@angular/common";
import {PushService} from "@services/push-notifications/push.service";

@Component({
  selector: 'signup-page',
  imports: [
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './signup-page.html',
  styleUrl: './signup-page.scss',
})
export class SignupPage {
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
  @Output() nextStep = new EventEmitter<void>();

  constructor(private http: HttpClient, private router: Router, private dataManager: DataManagerService, private pushService: PushService) {
  }

  toggleMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  ngAfterViewInit() {
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('container');

    if (signUpButton && container) {
      signUpButton.addEventListener('click', () => {
        container.classList.add('right-panel-active');
      });
    }

    if (signInButton && container) {
      signInButton.addEventListener('click', () => {
        container.classList.remove('right-panel-active');
      });
    }
  }

  onSignIn() {
    console.log('SignIn Payload:', this.signInForm.value);
    this.dataManager.login(this.signInForm.value.email, this.signInForm.value.password);
    this.enablePush();
  }

  onSignUp() {
    console.log('SignUp Payload:', this.signUpForm.value);
    const email = this.signUpForm.value.email;
    const password = this.signUpForm.value.password;

    // this.dataManager.post(`api/register`, this.signUpForm.value, {
    //   withCredentials: true
    // }).subscribe({
    //   next: () => {
    //     alert('Registration successful! You are now signed in.');
    //     const container = document.getElementById('container');
    //     // this.router.navigate(['/home']);
    //     if (container) container.classList.remove('right-panel-active');

    //     this.dataManager.login(email, password);
    //   },
    //   error: (error: any) => {
    //     // Specific 400 validation handling (e.g., {"email": ["user with this email already exists."]})
    //     const body = error?.error;
    //     let message = 'Unknown error';

    //     if (error?.status === 400 && body) {
    //       if (Array.isArray(body?.email) && body.email.length > 0) {
    //         message = body.email[0];
    //       } else if (typeof body?.email === 'string') {
    //         message = body.email;
    //       } else if (Array.isArray(body?.non_field_errors) && body.non_field_errors.length > 0) {
    //         message = body.non_field_errors[0];
    //       } else if (typeof body?.detail === 'string') {
    //         message = body.detail;
    //       } else if (typeof body?.message === 'string') {
    //         message = body.message;
    //       } else if (typeof body === 'string') {
    //         message = body;
    //       }
    //     } else if (typeof body?.detail === 'string') {
    //       message = body.detail;
    //     } else if (typeof body?.message === 'string') {
    //       message = body.message;
    //     } else if (typeof body === 'string') {
    //       message = body;
    //     }

    //     console.error('Registration failed:', error);
    //     alert(`Registration failed: ${message}`);
    //   }
    // });
    // this.loadgoalpage();
    this.enablePush();
    this.nextStep.emit();
  }

  enablePush() {
    this.pushService.subscribeToPush();
  }
}
