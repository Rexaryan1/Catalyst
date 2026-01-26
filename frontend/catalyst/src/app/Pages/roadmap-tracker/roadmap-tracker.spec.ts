import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoadmapTracker } from './roadmap-tracker';

describe('RoadmapTracker', () => {
  let component: RoadmapTracker;
  let fixture: ComponentFixture<RoadmapTracker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoadmapTracker]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoadmapTracker);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
