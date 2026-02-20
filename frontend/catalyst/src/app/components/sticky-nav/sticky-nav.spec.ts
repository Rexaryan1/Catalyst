import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StickyNav } from './sticky-nav';

describe('StickyNav', () => {
  let component: StickyNav;
  let fixture: ComponentFixture<StickyNav>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StickyNav]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StickyNav);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
