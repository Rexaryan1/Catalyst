import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, provideRouter } from '@angular/router';
import { NavBarComponent } from "./nav-bar/nav-bar.component";
import { Dashboard } from './dashboard/dashboard.component';
import { Route } from '@angular/router';
import { routes } from './app.routes';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NavBarComponent, Dashboard],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'catalyst';
}
