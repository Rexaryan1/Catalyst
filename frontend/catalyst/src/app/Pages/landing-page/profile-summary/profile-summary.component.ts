import { Component } from '@angular/core';
import { ScoreCardComponent } from "./score-card/score-card.component";
import { DataManagerService } from '@services/data-manager/data-manager.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-profile-summary',
  standalone: true,
  imports: [ScoreCardComponent],
  templateUrl: './profile-summary.component.html',
  styleUrl: './profile-summary.component.scss'
})
export class ProfileSummaryComponent {
  userProfile: any;
  constructor(private dataManager: DataManagerService, private router: Router) { }
  ngOnInit() {
    this.dataManager.select("api/user/profile").subscribe(profile => {
      this.userProfile = profile;
    });
  }

  navigateToProfile() {
    this.router.navigate(['/user-profile']);
  }

}
