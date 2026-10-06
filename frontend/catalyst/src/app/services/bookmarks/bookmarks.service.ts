import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataManagerService } from '@services/data-manager/data-manager.service';

export type BookmarkReason =
  | 'want_more_practice'
  | 'new_concept'
  | 'good_example'
  | 'curious';

export interface Bookmark {
  id: string;
  question_id: string;
  reason: BookmarkReason;
  reason_text: string | null;
  created_at: string;
}

export interface CreateBookmarkPayload {
  question_id: string;
  reason: BookmarkReason;
  reason_text?: string;
}

@Injectable({ providedIn: 'root' })
export class BookmarksService {
  constructor(private dataManager: DataManagerService) {}

  list(): Observable<Bookmark[]> {
    return this.dataManager.get<Bookmark[]>('api/bookmarks/', { withCredentials: true });
  }

  create(payload: CreateBookmarkPayload): Observable<Bookmark> {
    return this.dataManager.post<Bookmark>('api/bookmarks/', payload, { withCredentials: true });
  }

  delete(bookmarkId: string): Observable<void> {
    return this.dataManager.delete<void>(`api/bookmarks/${bookmarkId}/`, { withCredentials: true });
  }
}