import { Component ,Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-section-lines',
  imports: [CommonModule],
  templateUrl: './section-lines.html',
  styleUrl: './section-lines.scss',
  standalone: true,
})
export class SectionLines {
  @Input() rows: number[] = [];
  @Input() cols: number[] = [];
  @Input() color = '#46675D';
  @Input() squareSize = 12;

}
