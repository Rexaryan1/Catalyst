import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeaturesGridSection } from './features-grid-section';

describe('FeaturesGridSection', () => {
  let component: FeaturesGridSection;
  let fixture: ComponentFixture<FeaturesGridSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FeaturesGridSection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FeaturesGridSection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
