import { Component ,Input} from '@angular/core';

@Component({
  selector: 'app-roadmap-button',
  imports: [],
  templateUrl: './roadmap-button.html',
  styleUrl: './roadmap-button.scss',
})
export class RoadmapButton {
  @Input() buttonText: string = '';
  @Input() size: 'small' | 'medium' | 'large' = 'medium';


}
