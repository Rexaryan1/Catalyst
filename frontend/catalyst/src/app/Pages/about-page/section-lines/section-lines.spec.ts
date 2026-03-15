import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SectionLines } from './section-lines';

describe('SectionLines', () => {
  let component: SectionLines;
  let fixture: ComponentFixture<SectionLines>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SectionLines]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SectionLines);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
