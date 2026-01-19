import {Component, effect} from '@angular/core';
import { RouterOutlet, RouterLink, provideRouter } from '@angular/router';
import { NavBarComponent } from "./nav-bar/nav-bar.component";
import { LandingPage } from './Pages/landing-page/landing-page.component';
import { ApplicationConfig } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {NotificationHost} from "@components/noifications/notification-host/notification-host";
import {DataManagerService} from "@services/data-manager/data-manager.service";
import {PushService} from "@services/push-notifications/push.service";

// This is the main application component that serves as the root of the Angular application.
// It sets up the router outlet and includes the navigation bar and landing page.
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HttpClientModule, NotificationHost],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'catalyst';

  constructor(private dataManager: DataManagerService, private push: PushService) {
    this.push.initIncomingPushListener();
    effect(() => {
      const loggedIn = this.dataManager.isUserLoggedIn();
      if (loggedIn) {
        this.push.subscribeToPush();
      }
    });

  }
}
