import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import {TrustedBySection} from "@pages/about-page/trusted-by-section/trusted-by-section";
import {SectionLines} from "@pages/about-page/section-lines/section-lines";
import {AboutHeroSection} from "@pages/about-page/about-hero-section/about-hero-section";
import {FeaturesGridSection} from "@pages/about-page/features-grid-section/features-grid-section";
import {FooterSection} from "@pages/about-page/footer-section/footer-section";
import { DataManagerService } from '@services/data-manager/data-manager.service';


@Component({
  selector: 'app-about-page',
  imports: [
    CommonModule,
    RouterLink,
    TrustedBySection,
    SectionLines,
    AboutHeroSection,
    FeaturesGridSection,
    FooterSection,
  ],
  templateUrl: './about-page.html',
  styleUrl: './about-page.scss',

})

export class AboutPage {
  heroScrolled = false;

  constructor(private dataManager: DataManagerService) {}

  ngOnInit(): void {
    // Fire-and-forget warm-up call; do not block landing page render.
    this.dataManager.get('api/user', { withCredentials: true }).subscribe({
      next: () => {},
      error: () => {},
    });
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.heroScrolled = window.scrollY > 24;
  }

  scrollToDemo(): void {
    document.getElementById('demo')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}
