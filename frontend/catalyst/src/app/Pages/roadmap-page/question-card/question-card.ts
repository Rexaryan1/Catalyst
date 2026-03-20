import { Input, Component, Output, EventEmitter, OnChanges, SimpleChanges , OnDestroy} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Question } from '@components/cards/roadmap-item/roadmap-item.interface';
import { Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-question-card',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './question-card.html',
  styleUrl: './question-card.scss',
})

export class QuestionCard implements OnChanges, OnDestroy {
  @Input() questions: Question[] = [];
  @Input() index = 0;

  @Output() indexChange = new EventEmitter<number>();
  @Output() submitClicked = new EventEmitter<void>();

  @Output() answered = new EventEmitter<{
    question_id: string;
    selected_index: number;
    answered_at: string;
    time_taken_seconds: number;
  }>();

  selectedOption: number | null = null;
  isSubmitted = false;
  isCorrect: boolean | null = null;
  elapsedSeconds = 0;
  wasPreAnswered = false;

  private timerSubscription: Subscription | null = null;

  onSubmitClicked(){
    this.submitClicked.emit();
    this.stopTimer();
  }



  ngOnChanges(changes: SimpleChanges): void {
    if (changes['questions'] || changes['index']) {
      this.selectedOption = null;
      this.isSubmitted = false;
      this.isCorrect = null;
      this.stopTimer();
      this.elapsedSeconds = 0;
      this.startTimer();
      this.wasPreAnswered = this.question?.status === 'answered';
    }
  }

  ngOnDestroy(): void {
    this.stopTimer();
  }

  private startTimer(): void {
    // Timer emits every 1s
    this.timerSubscription = timer(0, 1000).subscribe(() => {
      this.elapsedSeconds++;
    });
  }

  private stopTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
      this.timerSubscription = null;
    }
  }

  get formattedTime(): string {
    const minutes = Math.floor(this.elapsedSeconds / 60);
    const seconds = this.elapsedSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
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
    this.stopTimer();
    this.isCorrect = this.selectedOption === q.correct_index;

    this.answered.emit({
      question_id: q.id,
      selected_index: this.selectedOption,
      answered_at: new Date().toISOString(),
      time_taken_seconds: this.elapsedSeconds
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


