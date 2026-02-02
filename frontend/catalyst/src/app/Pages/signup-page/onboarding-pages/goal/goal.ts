import { Component, Output, EventEmitter } from '@angular/core';
import { RoadmapButton } from '@pages/signup-page/butons/roadmap-button/roadmap-button';
import { DataManagerService } from '@services/data-manager/data-manager.service';
import { StepIndicatorComponent } from "../../stepper-small/stepper-small";

@Component({
  selector: 'app-goal',
  imports: [RoadmapButton, StepIndicatorComponent],
  templateUrl: './goal.html',
  styleUrl: './goal.scss',
})
export class Goal {
  @Output() nextStep = new EventEmitter<void>();

  selectedGoal: string = '';

  constructor(private dataManager: DataManagerService) { }

  ngOnInit() {
    var div = document.getElementsByClassName('skip')[0];
    div.addEventListener('click', this.skip.bind(this));
  }

  onGoalSelected(goal: string) {
    this.selectedGoal = goal;
    // Store in DataManagerService
    let signup_data: any = this.dataManager.snapshot("signup_profile_data") || {};
    signup_data['primary_goal'] = goal;
    this.dataManager.set("signup_profile_data", signup_data);
  }

  proceedToNext() {
    if (this.selectedGoal) {
      this.nextStep.emit();
    }
  }

  skip() {
    this.nextStep.emit();
  }
}
