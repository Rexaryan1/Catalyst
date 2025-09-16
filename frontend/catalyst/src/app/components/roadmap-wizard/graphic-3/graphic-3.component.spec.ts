import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Graphic3Component } from './graphic-3.component';

describe('Graphic3Component', () => {
  let component: Graphic3Component;
  let fixture: ComponentFixture<Graphic3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Graphic3Component]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(Graphic3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
