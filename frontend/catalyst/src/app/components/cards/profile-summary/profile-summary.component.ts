import { Component } from '@angular/core';
import { ScoreCardComponent } from "@components/cards/profile-summary/score-card/score-card.component";
import { DataManagerService } from '@services/data-manager/data-manager.service';

@Component({
  selector: 'app-profile-summary',
  standalone: true,
  imports: [ScoreCardComponent],
  templateUrl: './profile-summary.component.html',
  styleUrl: './profile-summary.component.scss'
})
export class ProfileSummaryComponent {
  userProfile: any;
  constructor(private dataManager: DataManagerService) { }
  ngOnInit() {
    this.dataManager.select("api/user/profile").subscribe(profile => {
      this.userProfile = profile;
    });
  }

  navigateToProfile() {
    window.location.href = '/userHome';
  }

}
