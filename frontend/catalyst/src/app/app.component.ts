import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, provideRouter } from '@angular/router';
import { NavBarComponent } from "./nav-bar/nav-bar.component";
import { LandingPage } from './Pages/landing-page/landing-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NavBarComponent, LandingPage],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'catalyst';
}
