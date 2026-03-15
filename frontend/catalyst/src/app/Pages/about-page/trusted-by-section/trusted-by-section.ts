import {CommonModule} from '@angular/common';
import {Component} from '@angular/core';
import {SectionLines} from "@pages/about-page/section-lines/section-lines";

interface UniversityLogo {
  name: string;
  src: string;
  alt: string;
}


@Component({
  selector: 'app-trusted-by-section',
  imports: [CommonModule, SectionLines],
  templateUrl: './trusted-by-section.html',
  styleUrl: './trusted-by-section.scss',
  standalone: true,
})
export class TrustedBySection {
  logos: UniversityLogo[] = [
    {name: 'IIT Delhi', src: 'assets/universities/iit-delhi.svg', alt: 'IIT Delhi logo'},
    {name: 'IIT Bombay', src: 'assets/universities/iit-bombay.svg', alt: 'IIT Bombay logo'},
    {name: 'BITS Pilani', src: 'assets/universities/bits-pilani.svg', alt: 'BITS Pilani logo'},
    {name: 'DTU', src: 'assets/universities/dtu.svg', alt: 'DTU logo'},
    {name: 'NSUT', src: 'assets/universities/nsut.svg', alt: 'NSUT logo'},
    {name: 'VIT', src: 'assets/universities/vit.svg', alt: 'VIT logo'},
  ];

}
