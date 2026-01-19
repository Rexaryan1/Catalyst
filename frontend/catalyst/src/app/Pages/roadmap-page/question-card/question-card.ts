import {Input, Component, Output, EventEmitter, input, OnChanges, SimpleChanges} from '@angular/core';
import {FormGroup, FormControl} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
//import {DataManagerService} from '@services/data-manager/data-manager.service';
import {Question} from '@components/cards/roadmap-item/roadmap-item.interface';


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

  selectedOption: number | null = null;
  isSubmitted = false;
  isCorrect: boolean | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['questions'] || changes['index']) {
      this.resetForNewQuestion();
      // reset any per-question UI state here if needed later
    }
  }

  get question(): Question | null {
    return this.questions?.[this.index] ?? null;
  }
  selectOption(i: number): void {
    if (this.isSubmitted) return; // lock selection after submission
    this.selectedOption = i;
  }
  checkAnswer(): void {
    const q = this.question;
    if (!q) return;

    if (this.selectedOption === null) {
      alert('Please select an option');
      return;
    }

    this.isSubmitted = true;
    this.isCorrect = this.selectedOption === q.correct_index;
  }

  continue(): void {
    // If not submitted yet, this acts like "Check Answer"
    if (!this.isSubmitted) {
      this.checkAnswer();
      return;
    }
    // If already submitted, go to next question
    this.next();
  }

  prev(): void {
    if (this.index > 0) this.indexChange.emit(this.index - 1);
  }

  next(): void {
    if (this.questions && this.index < this.questions.length - 1) {
      this.indexChange.emit(this.index + 1);
    }
    // selectedOption: number | null = null;
    //
    // constructor(private dataManager: DataManagerService) {
    // }
    //
    // question: any
    //
    // ngOnInit() {
    //   // Initialization logic here
    //   this.question = this.dataManager.snapshot("question")
    // }
    //
    // ngAfterViewInit() {
    //   const floating_btn = document.querySelector('.floating-btn');
    //   const close_btn = document.querySelector('.close-btn');
    //   const social_panel_container = document.querySelector('.social-panel-container');
    //
    //   if (floating_btn && social_panel_container) {
    //     floating_btn.addEventListener('click', () => {
    //       social_panel_container.classList.toggle('visible');
    //     });
    //   }
    //
    //   if (close_btn && social_panel_container) {
    //     close_btn.addEventListener('click', () => {
    //       social_panel_container.classList.remove('visible');
    //     });
  }
  optionClass(i: number): string {
    const q = this.question;
    if (!q) return '';

    if (!this.isSubmitted) {
      return this.selectedOption === i ? 'selected' : '';
    }

    // After submit: show correct + incorrect
    if (i === q.correct_index) return 'correct';
    if (this.selectedOption === i && i !== q.correct_index) return 'incorrect';
    return '';
  }
  private resetForNewQuestion(): void {
    this.selectedOption = null;
    this.isSubmitted = false;
    this.isCorrect = null;
  }

}

//   selectOption(index: number): void {
//     this.selectedOption = index;
//   }
//
//   checkAnswer(): void {
//     if (this.selectedOption === null) {
//       alert('Please select an option');
//       return;
//     }
//
//     const isCorrect = this.selectedOption === this.question.correct_index;
//     const message = isCorrect ?
//       'Correct!' :
//       `Incorrect! The correct answer was: ${this.question.options[this.question.correct_index]}`;
//
//     if (confirm(message + '\n\nClick OK to continue to next question')) {
//       this.selectedOption = null;
//       // Emit event to load next question if needed
//     }
//   }
// }


