import {Component, OnInit, OnDestroy, Output, EventEmitter} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Subject, takeUntil} from 'rxjs';
import {RoadmapItem , Question} from "@components/cards/roadmap-item/roadmap-item.interface";
import {RoadmapService} from './roadmap.service';
import {RoadmapItemComponent} from "@components/cards/roadmap-item/roadmap-item.component";

@Component({
  selector: 'app-roadmap-list',
  standalone: true,
  imports: [CommonModule, RoadmapItemComponent],
  templateUrl: './roadmap-list.component.html',
  styleUrls: ['./roadmap-list.component.scss']
})
export class RoadmapListComponent implements OnInit, OnDestroy {
  roadmapItems: RoadmapItem[] = [];
  private destroy$ = new Subject<void>();
  @Output() questionSelected = new EventEmitter<{ questions: Question[]; index: number }>();

  selectedRoadmapTitle: string | null = null;
  constructor(private roadmapService: RoadmapService) {
  }

  ngOnInit(): void {
    this.roadmapService.roadmapItems$
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        this.roadmapItems = items;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onSaveToggle(itemId: string): void {
    this.roadmapService.toggleSaveStatus(itemId);
  }

  onQuestionClick(event: { roadmapId: string, questionId: string }): void {
    console.log('Question clicked:', event);
    const item = this.roadmapItems.find(i => i.id === event.roadmapId);
    if (!item) return;

    this.selectedRoadmapTitle = item.title;
    const index = item.questions.findIndex(q => q.id === event.questionId);
    if (index < 0) return;

    this.questionSelected.emit({questions: item.questions, index});

    // Handle question click - navigate to question detail, etc.
  }
  onTitleClick(event: { roadmapId: string; title: string }): void {
    this.selectedRoadmapTitle = event.title;
  }

  onQuestionBookmark(event: { roadmapId: string, questionId: string }): void {
    this.roadmapService.toggleQuestionBookmark(event.roadmapId, event.questionId);
  }

  onToggleExpansion(itemId: string): void {
    this.roadmapService.toggleExpansion(itemId);
  }
}
