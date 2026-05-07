import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, ViewChild } from '@angular/core';
import { RouterLink } from '@angular/router';
import {TrustedBySection} from "@pages/about-page/trusted-by-section/trusted-by-section";
import {SectionLines} from "@pages/about-page/section-lines/section-lines";
import {AboutHeroSection} from "@pages/about-page/about-hero-section/about-hero-section";
import {FeaturesGridSection} from "@pages/about-page/features-grid-section/features-grid-section";
import {FooterSection} from "@pages/about-page/footer-section/footer-section";
import {AnimateOnScrollDirective} from "@app/directives/animate-on-scroll.directive";


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
    AnimateOnScrollDirective,
  ],
  templateUrl: './about-page.html',
  styleUrl: './about-page.scss',

})

export class AboutPage implements AfterViewInit, OnDestroy {
  heroScrolled = false;
  wordmarkVisible = false;

  @ViewChild('wordmarkEl') wordmarkEl?: ElementRef<HTMLElement>;
  private wordmarkObserver?: IntersectionObserver;

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.heroScrolled = window.scrollY > 24;
  }

  ngAfterViewInit(): void {
    if (!this.wordmarkEl) return;
    this.wordmarkObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          this.wordmarkVisible = true;
          this.wordmarkObserver?.disconnect();
        }
      },
      { threshold: 0.05 }
    );
    this.wordmarkObserver.observe(this.wordmarkEl.nativeElement);
  }

  ngOnDestroy(): void {
    this.wordmarkObserver?.disconnect();
  }

  scrollToDemo(): void {
    document.getElementById('demo')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  }
}
