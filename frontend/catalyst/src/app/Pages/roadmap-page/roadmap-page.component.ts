import { Component } from '@angular/core';
import { DataManagerService } from '@services/data-manager/data-manager.service';
import { RoadmapListComponent } from "@pages/roadmap-page/roadmap-list/roadmap-list.component";
import { NavBarComponent } from "@app/nav-bar/nav-bar.component";

@Component({
  selector: 'app-roadmap-page',
  standalone: true,
  imports: [RoadmapListComponent, NavBarComponent],
  templateUrl: './roadmap-page.component.html',
  styleUrl: './roadmap-page.component.scss'
})
export class RoadmapPageComponent {
  roadmapData: Object | null = null;
  constructor(private dataManager: DataManagerService) {}

  ngOnInit() {
    this.dataManager.select('roadmap').subscribe({
      next: (data) => {
        if (data) this.roadmapData = data;
        else console.log('No roadmap data found');
      },
      error: (error) => {
        console.error('Error fetching roadmap data:', error);
      }
    });
  }

  ngAfterViewInit() {
  }
}
