import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DataManagerService } from '@services/data-manager/data-manager.service';

export type FlagCategory =
  | 'answer_or_explanation_wrong'
  | 'options_unclear_or_not_distinct'
  | 'missing_table_image_or_related_question'
  | 'confusing_wording'
  | 'something_else';

export type FlagStatus = 'open' | string;

export interface FlagSubmission {
  id: string;
  question_id: string;
  categories: FlagCategory[];
  description: string | null;
  status: FlagStatus;
  created_at: string;
}

export interface CreateFlagPayload {
  question_id: string;
  categories?: FlagCategory[];
  description?: string;
}

@Injectable({ providedIn: 'root' })
export class FlagsService {
  constructor(private dataManager: DataManagerService) {}

  create(payload: CreateFlagPayload): Observable<FlagSubmission> {
    return this.dataManager.post<FlagSubmission>('api/flags/', payload, { withCredentials: true });
  }
}
