import { Component } from '@angular/core';
import {SectionLines} from "@pages/about-page/section-lines/section-lines";

@Component({
  selector: 'app-footer-section',
    imports: [
        SectionLines
    ],
  templateUrl: './footer-section.html',
  styleUrl: './footer-section.scss',
})
export class FooterSection {
  readonly rows = [0, 15, 85, 100];
  readonly cols = [15, 85];

}
