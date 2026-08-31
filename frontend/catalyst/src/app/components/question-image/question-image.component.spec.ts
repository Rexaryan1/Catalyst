import { ComponentFixture, TestBed } from '@angular/core/testing';
import { QuestionImageComponent } from './question-image.component';

describe('QuestionImageComponent', () => {
  let fixture: ComponentFixture<QuestionImageComponent>;
  let component: QuestionImageComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuestionImageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(QuestionImageComponent);
    component = fixture.componentInstance;
  });

  function setUrl(url: string): void {
    component.url = url;
    component.ngOnChanges({
      url: { currentValue: url, previousValue: null, firstChange: true, isFirstChange: () => true },
    });
    fixture.detectChanges();
  }

  it('starts in the loading state when a url is set', () => {
    setUrl('https://example.com/image.png');
    expect(component.state).toBe('loading');
    const skeleton = fixture.nativeElement.querySelector('.qi-skeleton');
    expect(skeleton).toBeTruthy();
  });

  it('transitions to loaded when the image fires (load)', () => {
    setUrl('https://example.com/image.png');
    component.onLoad();
    fixture.detectChanges();
    expect(component.state).toBe('loaded');
    expect(fixture.nativeElement.querySelector('.qi-error')).toBeFalsy();
    expect(fixture.nativeElement.querySelector('.qi-zoom-btn')).toBeTruthy();
  });

  it('shows an explicit error state when the image fires (error)', () => {
    setUrl('https://example.com/broken.png');
    component.onError();
    fixture.detectChanges();
    expect(component.state).toBe('error');
    const errorEl = fixture.nativeElement.querySelector('.qi-error-text');
    expect(errorEl?.textContent).toContain('Image failed to load');
  });

  it('retry() resets to loading and cache-busts the url', () => {
    setUrl('https://example.com/broken.png');
    component.onError();
    fixture.detectChanges();

    component.retry();
    fixture.detectChanges();

    expect(component.state).toBe('loading');
    expect(component.displayUrl).toBe('https://example.com/broken.png?retry=1');
  });

  it('does not open the zoom viewer while in the error state', () => {
    setUrl('https://example.com/broken.png');
    component.onError();
    fixture.detectChanges();

    const openSpy = spyOn((component as any).displayManager, 'open');
    component.openZoom();

    expect(openSpy).not.toHaveBeenCalled();
  });
});
