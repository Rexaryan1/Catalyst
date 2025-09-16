import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Graphic1Component } from './graphic-1.component';

describe('Graphic1Component', () => {
  let component: Graphic1Component;
  let fixture: ComponentFixture<Graphic1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Graphic1Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Graphic1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
