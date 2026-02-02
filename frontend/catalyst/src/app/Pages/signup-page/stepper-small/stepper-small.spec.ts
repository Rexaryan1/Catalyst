import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StepperSmall } from './stepper-small';

describe('StepperSmall', () => {
  let component: StepperSmall;
  let fixture: ComponentFixture<StepperSmall>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StepperSmall]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StepperSmall);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
