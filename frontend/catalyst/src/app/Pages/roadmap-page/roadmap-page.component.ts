import { Component } from '@angular/core';
import { DataManagerService } from '@services/data-manager/data-manager.service';
import { RoadmapListComponent } from "@pages/roadmap-page/roadmap-list/roadmap-list.component";
import { QuestionCard } from './question-card/question-card';
@Component({
  selector: 'app-roadmap-page',
  standalone: true,
  imports: [RoadmapListComponent, QuestionCard],
  templateUrl: './roadmap-page.component.html',
  styleUrl: './roadmap-page.component.scss'
})
export class RoadmapPageComponent {
  roadmapData: Object | null = null;
  activeQuestions: QuestionCard[] = [];
  activeIndex = 0;
  constructor(private dataManager: DataManagerService) { }

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

  onQuestionSelected(event: { questions: QuestionCard[]; index: number }): void {
    this.activeQuestions = event.questions ?? [];
    this.activeIndex = event.index ?? 0;
  }

  onIndexChange(nextIndex: number): void {
    if (!this.activeQuestions?.length) return;
    if (nextIndex < 0 || nextIndex >= this.activeQuestions.length) return;
    this.activeIndex = nextIndex;
  }

  ngAfterViewInit() {
  }
}
