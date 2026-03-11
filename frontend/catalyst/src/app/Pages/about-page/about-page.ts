import { Component } from '@angular/core';
import {HeroBackground} from "@pages/about-page/hero-background/hero-background";

@Component({
  selector: 'app-about-page',
  imports: [
    HeroBackground
  ],
  templateUrl: './about-page.html',
  styleUrl: './about-page.scss',

})
export class AboutPage {

}
