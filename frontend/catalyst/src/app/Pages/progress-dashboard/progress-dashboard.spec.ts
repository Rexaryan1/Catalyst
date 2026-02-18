import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressDashboard } from './progress-dashboard';

describe('ProgressDashboard', () => {
  let component: ProgressDashboard;
  let fixture: ComponentFixture<ProgressDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProgressDashboard]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProgressDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
