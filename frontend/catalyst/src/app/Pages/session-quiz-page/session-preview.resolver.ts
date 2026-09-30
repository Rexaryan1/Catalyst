import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { DataManagerService } from '@services/data-manager/data-manager.service';
import { RawFocusArea } from './session-quiz-page.component';
import { SESSION_PREVIEW_MOCK } from './session-preview.mock';

// The mock uses `topic` (matching the newer backend draft that adds
// stimulus_text/table_data for RC and DI sets); RawFocusArea still expects
// `topicName`, matching what /sessions/{id}/questions returns today.
function toFocusAreas(mock: typeof SESSION_PREVIEW_MOCK): RawFocusArea[] {
  return mock.focusAreas.map((area) => ({
    topicName: area.topic,
    type: area.type,
    questions: area.questions as RawFocusArea['questions'],
  }));
}

export const sessionPreviewResolver: ResolveFn<boolean> = () => {
  const dataManager = inject(DataManagerService);
  dataManager.set('sessionQuestions', { focusAreas: toFocusAreas(SESSION_PREVIEW_MOCK) });
  return true;
};