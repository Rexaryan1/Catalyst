import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeatmapSmall } from './heatmap-small';

describe('HeatmapSmall', () => {
  let component: HeatmapSmall;
  let fixture: ComponentFixture<HeatmapSmall>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeatmapSmall]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeatmapSmall);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
