import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoadmapButton } from './roadmap-button';

describe('RoadmapButton', () => {
  let component: RoadmapButton;
  let fixture: ComponentFixture<RoadmapButton>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoadmapButton]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoadmapButton);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
