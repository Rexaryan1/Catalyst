import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { SectionLines } from '@pages/about-page/section-lines/section-lines';

interface FeatureItem {
  title: string;
  text: string;
  row: number;
  col: number;
}

@Component({
  selector: 'app-features-grid-section',
  standalone: true,
  imports: [CommonModule, SectionLines],
  templateUrl: './features-grid-section.html',
  styleUrl: './features-grid-section.scss',
})
export class FeaturesGridSection {
  readonly rows = [10, 50, 90];
  readonly cols = [20, 50, 80];

  readonly features: FeatureItem[] = [
    {
      title: 'Block by Block',
      text: 'Complex topics, broken into structured question flows that make progress tangible.',
      row: 1,
      col: 1,
    },
    {
      title: 'Designed to Adapt',
      text: 'Custom-trained AI models shape each roadmap around your learning behavior.',
      row: 1,
      col: 2,
    },
    {
      title: 'Thinking Over Scrolling',
      text: 'A quiz-first approach that prioritizes active understanding over passive consumption.',
      row: 2,
      col: 1,
    },
    {
      title: 'Signals That Matter',
      text: 'Clear insights into your accuracy, pace, and progress without the noise.',
      row: 2,
      col: 2,
    },
  ];
}
