import { Component } from '@angular/core';
import { Input } from '@angular/core';
@Component({
  selector: 'app-score-card',
  standalone: true,
  imports: [],
  templateUrl: './score-card.component.html',
  styleUrl: './score-card.component.scss'
})
export class ScoreCardComponent {
  @Input() score: number | null = null;
  @Input() metricName: string | null = null;
}
