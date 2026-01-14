export interface RoadmapItem {
  id: string;
  title: string;
  summary: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  progressPercentage: number;
  isSaved: boolean;
  questions: Question[];
  isExpanded?: boolean;
}

export interface Question {
  id: string;
  title: string;
  summary: string;

  question_text: string;
  options: string[];
  correct_index: number;

  isBookmarked: boolean;
  difficulty: 'Easy' | 'Medium' | 'Hard';
}


