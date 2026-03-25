// app/roadmap/types.ts
export interface RoadmapRequest {
  subject: string;
  topic: string;
  additional_comments: string;
  // intent: 'exam' | 'upskilling' | 'revision' | 'understanding';
}
export interface RoadmapResponse {
  roadmapId: string;
  items: Array<{ title: string; description: string }>;
}
