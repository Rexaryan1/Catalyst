import { Input, Component, Output, EventEmitter } from '@angular/core';
import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { DataManagerService } from '@services/data-manager/data-manager.service';

@Component({
  selector: 'app-beta-page',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent {
  private path = 'login';

  signInForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  });

  signUpForm = new FormGroup({
    name: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl('')
  });

  constructor(private http: HttpClient, private router: Router, private dataManagerService: DataManagerService) { }

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
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.dataManagerService.post(`${this.path}`, this.signInForm.value, {
      headers,
      withCredentials: true
    }).subscribe({
      next: (response: any) => {
        localStorage.setItem('jwt', response.jwt);
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        console.error('Login failed:', error);
        alert('Login failed: ' + (error.error?.detail || 'Unknown error'));
      }
    });
  }

  onSignUp() {
    console.log('SignUp Payload:', this.signUpForm.value);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.http.post(`http://localhost:8000/api/register`, this.signUpForm.value, {
      headers,
      withCredentials: true
    }).subscribe({
      next: () => {
        alert('Registration successful! Please sign in');
        const container = document.getElementById('container');
        if (container) container.classList.remove("right-panel-active");
      },
      error: (error) => {
        console.error('Registration failed:', error);
        alert('Registration failed: ' + (error.error?.detail || 'Unknown error'));
      }
    });
  }

}

