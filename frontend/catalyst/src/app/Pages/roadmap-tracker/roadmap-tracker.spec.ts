import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoadmapTrackerComponent } from './roadmap-tracker';

describe('RoadmapTracker', () => {
  let component: RoadmapTrackerComponent;
  let fixture: ComponentFixture<RoadmapTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoadmapTrackerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RoadmapTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
