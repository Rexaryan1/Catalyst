import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { RoadmapItem, Question } from "@components/cards/roadmap-item/roadmap-item.interface";
import { DataManagerService } from '@services/data-manager/data-manager.service';

@Injectable({
  providedIn: 'root'
})
export class RoadmapService {
  private roadmapItemsSubject = new BehaviorSubject<RoadmapItem[]>([]);
  roadmapItems$: Observable<RoadmapItem[]> = this.roadmapItemsSubject.asObservable();

  private roadmapIdSubject = new BehaviorSubject<string | null>(null);
  roadmapId$: Observable<string | null> = this.roadmapIdSubject.asObservable();

  constructor(private http: HttpClient, private dataManager: DataManagerService) {
    this.dataManager.select('roadmap').subscribe({
      next: (data: any) => {
        if (data && data?.data?.roadmapItems) {
          this.roadmapItemsSubject.next(data.data.roadmapItems);

          if (data?.data?.roadmap_id) {
            this.roadmapIdSubject.next(data.data.roadmap_id);
          }
        } else {
          console.log('No roadmap data found in DataManagerService');
          this.loadDataFromJson();
        }
      }
    });
  }

  // ... existing code ...

  private loadDataFromJson(): void {
    this.http.get<any>('/assets/data/example2.json')
      .subscribe(data => {
        const roadmapItems = data.data?.roadmapItems;
        this.roadmapItemsSubject.next(roadmapItems);

        if (data?.data?.roadmap_id) {
          this.roadmapIdSubject.next(data.data.roadmap_id);
        }
      });
  }

  getRoadmapItems(): RoadmapItem[] {
    return this.roadmapItemsSubject.value;
  }

  getRoadmapId(): string | null {
    return this.roadmapIdSubject.value;
  }

  updateRoadmapItem(updatedItem: RoadmapItem): void {
    const currentItems = this.roadmapItemsSubject.value;
    const updatedItems = currentItems.map(item =>
      item.id === updatedItem.id ? updatedItem : item
    );
    this.roadmapItemsSubject.next(updatedItems);
  }

  toggleSaveStatus(itemId: string): void {
    const currentItems = this.roadmapItemsSubject.value;
    const updatedItems = currentItems.map(item =>
      item.id === itemId ? { ...item, isSaved: !item.isSaved } : item
    );
    this.roadmapItemsSubject.next(updatedItems);
  }

  toggleExpansion(itemId: string): void {
    const currentItems = this.roadmapItemsSubject.value;
    const updatedItems = currentItems.map(item =>
      item.id === itemId ? { ...item, isExpanded: !item.isExpanded } : item
    );
    this.roadmapItemsSubject.next(updatedItems);
  }

  toggleQuestionBookmark(roadmapId: string, questionId: string): void {
    const currentItems = this.roadmapItemsSubject.value;
    const updatedItems = currentItems.map(item => {
      if (item.id === roadmapId) {
        const updatedQuestions = item.questions.map(question =>
          question.id === questionId
            ? { ...question, isBookmarked: !question.isBookmarked }
            : question
        );
        return { ...item, questions: updatedQuestions };
      }
      return item;
    });
    this.roadmapItemsSubject.next(updatedItems);
  }

  updateProgress(itemId: string, progressPercentage: number): void {
    const currentItems = this.roadmapItemsSubject.value;
    const updatedItems = currentItems.map(item =>
      item.id === itemId ? { ...item, progressPercentage } : item
    );
    this.roadmapItemsSubject.next(updatedItems);
  }

  addRoadmapItem(newItem: RoadmapItem): void {
    const currentItems = this.roadmapItemsSubject.value;
    this.roadmapItemsSubject.next([...currentItems, newItem]);
  }

  removeRoadmapItem(itemId: string): void {
    const currentItems = this.roadmapItemsSubject.value;
    const filteredItems = currentItems.filter(item => item.id !== itemId);
    this.roadmapItemsSubject.next(filteredItems);
  }

  addQuestion(roadmapId: string, newQuestion: Question): void {
    const currentItems = this.roadmapItemsSubject.value;
    const updatedItems = currentItems.map(item => {
      if (item.id === roadmapId) {
        return { ...item, questions: [...item.questions, newQuestion] };
      }
      return item;
    });
    this.roadmapItemsSubject.next(updatedItems);
  }

  removeQuestion(roadmapId: string, questionId: string): void {
    const currentItems = this.roadmapItemsSubject.value;
    const updatedItems = currentItems.map(item => {
      if (item.id === roadmapId) {
        const updatedQuestions = item.questions.filter(q => q.id !== questionId);
        return { ...item, questions: updatedQuestions };
      }
      return item;
    });
    this.roadmapItemsSubject.next(updatedItems);
  }
}
