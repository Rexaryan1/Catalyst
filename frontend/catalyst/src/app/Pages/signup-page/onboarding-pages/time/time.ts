import { Component, Output, EventEmitter } from '@angular/core';
import { DataManagerService } from '@services/data-manager/data-manager.service';
import { MatSliderModule } from '@angular/material/slider';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-time',
  imports: [MatSliderModule, CommonModule],
  templateUrl: './time.html',
  styleUrl: './time.scss',
})
export class Time {
  @Output() nextStep = new EventEmitter<void>();

  selectedTime: number = 5;

  constructor(private dataManager: DataManagerService) { }

  ngOnInit() {
    var div = document.getElementsByClassName('skip')[0];
    div.addEventListener('click', this.skip.bind(this));
  }

  formatLabel(value: number): string {
    return value + ' hrs/week';
  }

  onTimeChanged(value: number | null) {
    if (value === null) return;
    this.selectedTime = value;

    // Store in DataManagerService
    let signup_data: any = this.dataManager.snapshot("signup_profile_data") || {};
    signup_data['time_commitment_hours'] = value;
    this.dataManager.set("signup_profile_data", signup_data);
  }

  registerUser() {
    var signup_profile_data: any = this.dataManager.snapshot("signup_profile_data");
    var signup_data: any = this.dataManager.snapshot("signup_data");
    console.log('Registering user with profile data:', signup_profile_data);

    this.dataManager.post(`api/profile/onboard`, signup_profile_data, {
      withCredentials: true
    }).subscribe({
      next: () => {
        alert('Profile Registration successful! You are now signed in.');
        this.dataManager.login(signup_data.email, signup_data.password);
      },
      error: (error: any) => {
        // Specific 400 validation handling (e.g., {"email": ["user with this email already exists."]})
        const body = error?.error;
        let message = 'Unknown error';

        if (error?.status === 400 && body) {
          if (Array.isArray(body?.email) && body.email.length > 0) {
            message = body.email[0];
          } else if (typeof body?.email === 'string') {
            message = body.email;
          }
          if (Array.isArray(body?.name) && body.name.length > 0) {
            message = body.name[0];
          }
          else if (Array.isArray(body?.non_field_errors) && body.non_field_errors.length > 0) {
            message = body.non_field_errors[0];
          } else if (typeof body?.detail === 'string') {
            message = body.detail;
          } else if (typeof body?.message === 'string') {
            message = body.message;
          } else if (typeof body === 'string') {
            message = body;
          }
        } else if (typeof body?.detail === 'string') {
          message = body.detail;
        } else if (typeof body?.message === 'string') {
          message = body.message;
        } else if (typeof body === 'string') {
          message = body;
        }

        console.error('Registration failed:', error);
        alert(`Registration failed: ${message}`);

      }
    });
  }

  proceedToNext() {
    this.registerUser();
  }

  skip() {
    this.registerUser();
  }
}
