import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroBackground } from './hero-background';

describe('HeroBackground', () => {
  let component: HeroBackground;
  let fixture: ComponentFixture<HeroBackground>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroBackground]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeroBackground);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
