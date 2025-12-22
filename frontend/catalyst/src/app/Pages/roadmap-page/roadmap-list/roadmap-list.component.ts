import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { RoadmapItem } from "@components/cards/roadmap-item/roadmap-item.interface";
import { RoadmapService } from './roadmap.service';
import { RoadmapItemComponent } from "@components/cards/roadmap-item/roadmap-item.component";

@Component({
  selector: 'app-roadmap-list',
  standalone: true,
  imports: [CommonModule, RoadmapItemComponent],
  templateUrl: './roadmap-list.component.html' ,
  styleUrls: ['./roadmap-list.component.scss']
})
export class RoadmapListComponent implements OnInit, OnDestroy {
  roadmapItems: RoadmapItem[] = [];
  private destroy$ = new Subject<void>();

  constructor(private roadmapService: RoadmapService) {}

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

  onQuestionClick(event: {roadmapId: string, questionId: string}): void {
    console.log('Question clicked:', event);
    // Handle question click - navigate to question detail, etc.
  }

  onQuestionBookmark(event: {roadmapId: string, questionId: string}): void {
    this.roadmapService.toggleQuestionBookmark(event.roadmapId, event.questionId);
  }

  onToggleExpansion(itemId: string): void {
    this.roadmapService.toggleExpansion(itemId);
  }
}
