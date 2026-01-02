import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Goal } from './goal';

describe('Goal', () => {
  let component: Goal;
  let fixture: ComponentFixture<Goal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Goal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Goal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
