import { Component } from '@angular/core';
import {RoadmapListComponent} from "@pages/roadmap-page/roadmap-list/roadmap-list.component";

@Component({
  selector: 'app-solution-page',
  imports: [RoadmapListComponent],
  templateUrl: './solution-page.html',
  styleUrl: './solution-page.scss',
})
export class SolutionPage {
  isSidebarHidden = false;

  toggleSidebar() {
    this.isSidebarHidden = !this.isSidebarHidden;
  }

}
