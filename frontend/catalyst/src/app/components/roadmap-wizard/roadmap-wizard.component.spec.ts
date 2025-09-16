import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoadmapWizardComponent } from './roadmap-wizard.component';

describe('RoadmapWizardComponent', () => {
  let component: RoadmapWizardComponent;
  let fixture: ComponentFixture<RoadmapWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RoadmapWizardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RoadmapWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
