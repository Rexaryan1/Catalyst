import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MathTextComponent, parseSegments } from './math-text.component';

describe('parseSegments', () => {
  it('splits plain text with no math into a single text segment', () => {
    expect(parseSegments('just plain text')).toEqual([
      { type: 'text', content: 'just plain text' },
    ]);
  });

  it('extracts a single math expression surrounded by text', () => {
    expect(parseSegments('The area is $\\pi r^2$ square units.')).toEqual([
      { type: 'text', content: 'The area is ' },
      { type: 'math', content: '\\pi r^2' },
      { type: 'text', content: ' square units.' },
    ]);
  });

  it('handles multiple math expressions in one string', () => {
    expect(parseSegments('$a$ plus $b$ equals $c$')).toEqual([
      { type: 'math', content: 'a' },
      { type: 'text', content: ' plus ' },
      { type: 'math', content: 'b' },
      { type: 'text', content: ' equals ' },
      { type: 'math', content: 'c' },
    ]);
  });

  it('renders an escaped dollar sign as a literal $ in text, not a delimiter', () => {
    expect(parseSegments('This costs \\$50.')).toEqual([
      { type: 'text', content: 'This costs $50.' },
    ]);
  });

  it('does not let an escaped dollar sign interfere with real math nearby', () => {
    // Regression case: naive /\$(.+?)\$/g would treat the escaped $ as a
    // boundary and misparse everything after it.
    expect(parseSegments('It costs \\$50, which is $\\frac{1}{2}$ of the total.')).toEqual([
      { type: 'text', content: 'It costs $50, which is ' },
      { type: 'math', content: '\\frac{1}{2}' },
      { type: 'text', content: ' of the total.' },
    ]);
  });

  it('renders a string with only escaped dollars and no real math as plain text', () => {
    const segments = parseSegments('Prices are \\$10, \\$20, and \\$30.');
    expect(segments).toEqual([
      { type: 'text', content: 'Prices are $10, $20, and $30.' },
    ]);
    expect(segments.every((s) => s.type === 'text')).toBe(true);
  });

  it('preserves backslash commands inside math (\\frac, \\times, \\%)', () => {
    expect(parseSegments('$\\frac{3}{4} \\times 100\\%$')).toEqual([
      { type: 'math', content: '\\frac{3}{4} \\times 100\\%' },
    ]);
  });

  it('handles an empty string', () => {
    expect(parseSegments('')).toEqual([]);
  });
});

describe('MathTextComponent', () => {
  let fixture: ComponentFixture<MathTextComponent>;
  let component: MathTextComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MathTextComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MathTextComponent);
    component = fixture.componentInstance;
  });

  function setText(text: string): void {
    component.text = text;
    component.ngOnChanges({
      text: {
        currentValue: text,
        previousValue: undefined,
        firstChange: true,
        isFirstChange: () => true,
      },
    });
    fixture.detectChanges();
  }

  it('renders plain text without invoking KaTeX', () => {
    setText('No math here at all.');
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.math-text__math')).toBeNull();
    expect(el.textContent).toContain('No math here at all.');
  });

  it('renders a real formula from Percentages-style content: percentage change', () => {
    // "What is 25% of 80, expressed as $\frac{1}{4} \times 80$?"
    setText('What is 25% of 80, expressed as $\\frac{1}{4} \\times 80$?');
    const el: HTMLElement = fixture.nativeElement;
    const mathEl = el.querySelector('.math-text__math');
    expect(mathEl).not.toBeNull();
    expect(mathEl?.querySelector('.katex')).not.toBeNull();
  });

  it('renders a real formula from Percentages-style content: percentage increase', () => {
    // "Percentage increase is $\frac{\text{New} - \text{Old}}{\text{Old}} \times 100\%$"
    setText(
      'Percentage increase is $\\frac{\\text{New} - \\text{Old}}{\\text{Old}} \\times 100\\%$',
    );
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.math-text__math .katex')).not.toBeNull();
  });

  it('renders a real formula from Percentages-style content: successive percentage change', () => {
    // "Net change = $\left(1 + \frac{x}{100}\right)\left(1 - \frac{y}{100}\right)$"
    setText(
      'Net change = $\\left(1 + \\frac{x}{100}\\right)\\left(1 - \\frac{y}{100}\\right)$',
    );
    const el: HTMLElement = fixture.nativeElement;
    expect(el.querySelector('.math-text__math .katex')).not.toBeNull();
  });

  it('renders a literal price alongside real math without either interfering', () => {
    setText('A shirt costs \\$50 after a $\\frac{1}{2}$ discount.');
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('A shirt costs $50 after a');
    expect(el.querySelector('.math-text__math .katex')).not.toBeNull();
  });

  it('does not crash on malformed LaTeX', () => {
    expect(() => setText('Broken: $\\frac{1}{$')).not.toThrow();
    const el: HTMLElement = fixture.nativeElement;
    // katex still emits an error span rather than throwing when throwOnError is false
    expect(el.querySelector('.math-text__math')).not.toBeNull();
  });
});