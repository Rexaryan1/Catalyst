import { Input, Component, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { DataManagerService } from '@services/data-manager/data-manager.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {

  @Output() closeLogin = new EventEmitter<void>();
  close(): void {
    this.closeLogin.emit();
  }

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

  ngAfterViewInit() {
    const signUpButton = document.getElementById('signUp');
    const signInButton = document.getElementById('signIn');
    const container = document.getElementById('container');

    if (signUpButton && container) {
      signUpButton.addEventListener('click', () => {
        container.classList.add("right-panel-active");
      });
    }

    if (signInButton && container) {
      signInButton.addEventListener('click', () => {
        container.classList.remove("right-panel-active");
      });
    }
  }
  onSignIn() {
    console.log('SignIn Payload:', this.signInForm.value);
    this.dataManager.login(this.signInForm.value.email, this.signInForm.value.password);
  }

  onSignUp() {
    console.log('SignUp Payload:', this.signUpForm.value);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.dataManager.post(`api/register`, this.signUpForm.value, {
      withCredentials: true
    }).subscribe({
      next: () => {
        alert('Registration successful! Please sign in');
        const container = document.getElementById('container');
        this.router.navigate(['/home']);
        if (container) container.classList.remove("right-panel-active");
      },
      error: (error) => {
        console.error('Registration failed:', error);
        alert('Registration failed: ' + (error.error?.detail || 'Unknown error'));
      }
    });
  }

}

