import { Component, signal, viewChild, ViewContainerRef } from '@angular/core';
// import { LoginPageComponent } from "../components/cards/login-card/login-page.component";
import { NgIf } from '@angular/common';
import { DataManagerService } from '@services/data-manager/data-manager.service';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [NgIf, RouterLink],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent {

  userName = '';
  userAvatar = 'assets/aryan.jpg';
  constructor(public dataManager: DataManagerService) {
  }

  ngOnInit(): void {
    this.dataManager.select('userProfile').subscribe((profile: any) => {
      if (profile) {
        this.userName = profile.name;
        this.userAvatar = profile.avatar || 'assets/aryan.jpg';
      }
    });
  }

}