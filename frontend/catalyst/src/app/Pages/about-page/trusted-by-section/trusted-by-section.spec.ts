import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrustedBySection } from './trusted-by-section';

describe('TrustedBySection', () => {
  let component: TrustedBySection;
  let fixture: ComponentFixture<TrustedBySection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TrustedBySection]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrustedBySection);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
