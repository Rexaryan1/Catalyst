import { Component } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'topic-tag',
  imports: [],
  templateUrl: './topic-tag.html',
  styleUrl: './topic-tag.scss',
})
export class TopicTag {
  @Input() topic: string = 'Default Topic';

}
