import { Component } from '@angular/core';

@Component({
  selector: 'app-solution-page',
  imports: [],
  templateUrl: './solution-page.html',
  styleUrl: './solution-page.scss',
})
export class SolutionPage {
  isSidebarHidden = false;

  toggleSidebar() {
    this.isSidebarHidden = !this.isSidebarHidden;
  }

}
