import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-roadmap-button',
  imports: [CommonModule],
  templateUrl: './roadmap-button.html',
  styleUrl: './roadmap-button.scss',
})
export class RoadmapButton {
  @Input() buttonText: string = '';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';
  @Input() isSelected: boolean = false;
  @Output() buttonClicked = new EventEmitter<string>();

  onButtonClick(): void {
    this.isSelected = !this.isSelected;
    this.buttonClicked.emit(this.buttonText);
  }
}
