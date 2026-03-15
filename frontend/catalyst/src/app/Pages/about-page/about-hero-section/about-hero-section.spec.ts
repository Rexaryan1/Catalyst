import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutHeroSection } from './about-hero-section';

describe('AboutHeroSection', () => {
  let component: AboutHeroSection;
  let fixture: ComponentFixture<AboutHeroSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutHeroSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AboutHeroSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
