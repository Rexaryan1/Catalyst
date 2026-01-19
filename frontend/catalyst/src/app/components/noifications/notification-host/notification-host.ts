import {Component} from '@angular/core';
import {AsyncPipe, NgFor, NgIf} from '@angular/common';
import {InAppNotificationsService} from '@services/notifications/in-app-notifications.service';

@Component({
  selector: 'app-notification-host',
  standalone: true,
  imports: [NgFor, NgIf, AsyncPipe],
  templateUrl: './notification-host.html',
  styleUrl: './notification-host.scss',
})
export class NotificationHost {
  constructor(public inApp: InAppNotificationsService) {
  }
}


