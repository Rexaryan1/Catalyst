import { Component, signal, viewChild, ViewContainerRef } from '@angular/core';
import { LoginPageComponent } from "../components/cards/login-card/login-page.component";
import { NgIf } from '@angular/common';
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
  userLoggedIn = signal<boolean>(true);

  userName = 'Aryan V.';
  userAvatar = 'assets/aryan.jpg';

  renderLogin(): void {
    // Logic to render the login page can be added here
    this.toggleLoginVisibility();
  }

  ///* Helper functions to close the login page and Overlay */
  toggleLoginVisibility() {
    this.showLoginPage.set(!this.showLoginPage());
    if (this.showLoginPage()) {
      const overlay = document.getElementById('overlay');
      if (overlay) {
        overlay.style.display = 'block';
      }
      overlay?.addEventListener('click', () => {
        this.showLoginPage.set(false);
        overlay.style.display = 'none';
      });
    }
  }
}