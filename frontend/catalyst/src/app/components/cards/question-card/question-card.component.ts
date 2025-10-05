import { Input, Component, Output, EventEmitter, input } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { DataManagerService } from '@services/data-manager/data-manager.service';

@Component({
  selector: 'app-question-card',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './question-card.component.html',
  styleUrl: './question-card.component.scss'
})
export class QuestionCardComponent {

  constructor(private dataManager: DataManagerService) {}

  question: any
  ngOnInit() {
    // Initialization logic here
    this.question = this.dataManager.snapshot("question")

  }

  ngAfterViewInit() {
    const floating_btn = document.querySelector('.floating-btn');
    const close_btn = document.querySelector('.close-btn');
    const social_panel_container = document.querySelector('.social-panel-container');

    if (floating_btn && social_panel_container) {
      floating_btn.addEventListener('click', () => {
        social_panel_container.classList.toggle('visible');
      });
    }

    if (close_btn && social_panel_container) {
      close_btn.addEventListener('click', () => {
        social_panel_container.classList.remove('visible');
      });
    }
  }
}

