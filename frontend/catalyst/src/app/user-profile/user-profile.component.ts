import { Component } from '@angular/core';
import { DashboardCardComponent } from "../cards/dashboard-card/dashboard-card.component";

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [DashboardCardComponent],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss'
})
export class UserProfileComponent {

}
