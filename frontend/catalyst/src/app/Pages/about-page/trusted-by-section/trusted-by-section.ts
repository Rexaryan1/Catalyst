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
    {name: 'IIT Delhi', src: 'assets/universities/IITD.png', alt: 'IIT Delhi logo'},
    {name: 'IIIT Delhi', src: 'assets/universities/IIITD.png', alt: 'IIT Bombay logo'},
    {name: 'BITS Pilani', src: 'assets/universities/Washington.png', alt: 'BITS Pilani logo'},
    {name: 'DTU', src: 'assets/universities/DTU.png', alt: 'DTU logo'},
    {name: 'NSUT', src: 'assets/universities/Michigan.png', alt: 'NSUT logo'},
    //{name: 'VIT', src: 'assets/universities/vit.svg', alt: 'VIT logo'},
  ];

}
