import { Component, signal } from '@angular/core';
import { LoginPageComponent } from "../login-page/login-page.component";
import { NgIf } from '@angular/common';
import e from 'express';
@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [LoginPageComponent, NgIf
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {
  showLoginPage = signal<boolean>(false);

  renderLogin(): void {
    // Logic to render the login page can be added here
    this.toggleLoginVisibility();
    const overlay = document.getElementById('overlay');
    if (overlay) {
      overlay.style.display = 'block';
    }
  }

  ///* Helper functions to close the login page */
  toggleLoginVisibility() {
    this.showLoginPage.set(!this.showLoginPage());
    if (this.showLoginPage()) {
      const overlay = document.getElementById('overlay');
      if (overlay) {
        overlay.style.display = 'block';
      }
      overlay?.addEventListener('click', () => {
        this.toggleLoginVisibility();
        overlay.style.display = 'none';
      });
    }
  }
}
