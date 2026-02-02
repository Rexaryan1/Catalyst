import { Input, Component, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Question } from '@components/cards/roadmap-item/roadmap-item.interface';

@Component({
  selector: 'app-question-card',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './question-card.html',
  styleUrl: './question-card.scss',
})
export class QuestionCard implements OnChanges {
  @Input() questions: Question[] = [];
  @Input() index = 0;

  @Output() indexChange = new EventEmitter<number>();

  @Output() answered = new EventEmitter<{
    question_id: string;
    selected_index: number;
    answered_at: string;
  }>();

  selectedOption: number | null = null;
  isSubmitted = false;
  isCorrect: boolean | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['questions'] || changes['index']) {
      this.selectedOption = null;
      this.isSubmitted = false;
      this.isCorrect = null;
    }
  }

  get question(): Question | null {
    return this.questions?.[this.index] ?? null;
  }

  selectOption(i: number): void {
    if (this.isSubmitted) return;
    this.selectedOption = i;
  }

  checkAnswer(): void {
    const q = this.question;
    if (!q) return;

    if (this.selectedOption === null) {
      alert('Please select an option');
      return;
    }
    if (q.correct_index === undefined) {
      alert('This question does not have a correct answer configured.');
      return;
    }

    this.isSubmitted = true;
    this.isCorrect = this.selectedOption === q.correct_index;

    this.answered.emit({
      question_id: q.id,
      selected_index: this.selectedOption,
      answered_at: new Date().toISOString(),
    });
  }

  continue(): void {
    if (!this.isSubmitted) {
      this.checkAnswer();
      return;
    }
    this.next();
  }

  prev(): void {
    if (this.index > 0) this.indexChange.emit(this.index - 1);
  }

  next(): void {
    if (this.questions && this.index < this.questions.length - 1) {
      this.indexChange.emit(this.index + 1);
    }
  }

  optionClass(i: number): string {
    const q = this.question;
    if (!q) return '';

    if (!this.isSubmitted) return this.selectedOption === i ? 'selected' : '';
    if (q.correct_index === undefined) return '';
    if (i === q.correct_index) return 'correct';
    if (this.selectedOption === i && i !== q.correct_index) return 'incorrect';
    return '';
  }
}


