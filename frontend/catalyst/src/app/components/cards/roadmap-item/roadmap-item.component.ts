import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoadmapItem, Question } from './roadmap-item.interface';
import { DisplayManagerService } from '@services/display-manager/display-manager.service';
import { DataManagerService } from '@services/data-manager/data-manager.service';
@Component({
  selector: 'app-roadmap-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './roadmap-item.component.html',
  styleUrls: ['./roadmap-item.component.scss']
})

export class RoadmapItemComponent {
  constructor(private displayManager: DisplayManagerService, private dataManager: DataManagerService) {}

  @Input() roadmapItem!: RoadmapItem;
  @Output() saveToggle = new EventEmitter<string>();
  @Output() questionClick = new EventEmitter<{roadmapId: string, questionId: string}>();
  @Output() questionBookmark = new EventEmitter<{roadmapId: string, questionId: string}>();
  @Output() toggleExpansion = new EventEmitter<string>();

  @Output() titleClick = new EventEmitter<{ roadmapId: string; title: string }>();

  onSaveToggle(): void {
    this.saveToggle.emit(this.roadmapItem.id);
  }

  onToggleExpansion(): void {
    this.toggleExpansion.emit(this.roadmapItem.id);
  }

  onQuestionClick(question: any): void {
    this.questionClick.emit({
      roadmapId: this.roadmapItem.id,
      questionId: question.id
    });

    //this.dataManager.set("question", question);

    //this.displayManager.displayOverlay("question", question.id);
  }

  onQuestionBookmark(questionId: string): void {
    this.questionBookmark.emit({
      roadmapId: this.roadmapItem.id,
      questionId: questionId
    });
  }

  getDifficultyClass(difficulty: string): string {
    return `difficulty-${difficulty.toLowerCase()}`;
  }
  onTitleClick(): void {
    this.titleClick.emit({ roadmapId: this.roadmapItem.id, title: this.roadmapItem.title });
  }
}


