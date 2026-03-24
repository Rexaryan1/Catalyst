import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromptPage } from './prompt-page';

describe('PromptPage', () => {
  let component: PromptPage;
  let fixture: ComponentFixture<PromptPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromptPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromptPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
