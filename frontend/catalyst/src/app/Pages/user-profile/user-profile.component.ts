import { Component } from '@angular/core';
import { DashboardCardComponent } from '@app/components/cards/dashboard-card/dashboard-card.component';
@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [DashboardCardComponent],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent {
  user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'
  };


}
