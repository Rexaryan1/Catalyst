import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardCardComponent } from '../../components/cards/dashboard-card/dashboard-card.component';
import { NavBarComponent } from "../../nav-bar/nav-bar.component";
import { LoginPageComponent } from "@app/Pages/landing-page/join-card/login-page.component";

@Component({
  selector: 'dashboard',
  standalone: true,
  imports: [DashboardCardComponent, NavBarComponent, CommonModule, LoginPageComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPage {
  showLoginPage = signal<boolean>(false);

  openBetaCard(): void {
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

