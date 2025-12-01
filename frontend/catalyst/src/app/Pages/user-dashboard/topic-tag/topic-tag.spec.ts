import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicTag } from './topic-tag';

describe('TopicTag', () => {
  let component: TopicTag;
  let fixture: ComponentFixture<TopicTag>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopicTag]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopicTag);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
