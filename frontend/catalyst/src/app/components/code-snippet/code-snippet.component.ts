import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import hljs from 'highlight.js/lib/core';
import c from 'highlight.js/lib/languages/c';
import cpp from 'highlight.js/lib/languages/cpp';
import csharp from 'highlight.js/lib/languages/csharp';
import java from 'highlight.js/lib/languages/java';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import python from 'highlight.js/lib/languages/python';
import bash from 'highlight.js/lib/languages/bash';
import sql from 'highlight.js/lib/languages/sql';
import json from 'highlight.js/lib/languages/json';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';

hljs.registerLanguage('c', c);
hljs.registerLanguage('cpp', cpp);
hljs.registerLanguage('c++', cpp);
hljs.registerLanguage('csharp', csharp);
hljs.registerLanguage('java', java);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('js', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('ts', typescript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('py', python);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('sh', bash);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('json', json);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('css', css);

interface CodeLine {
  num: number;
  html: SafeHtml;
  highlighted: boolean;
}

/**
 * Accepts either format seen for snippet_line_range:
 *  - a string like "3", "3-5", "3,5,7-9"
 *  - a [start, end] tuple, e.g. [3, 5] (inclusive range) or [3, 3] (single line)
 *  - a flat number[] of individual line numbers (used when length !== 2)
 */
function parseLineRange(range: string | number[]): Set<number> {
  const lines = new Set<number>();

  if (Array.isArray(range)) {
    if (range.length === 2) {
      const [start, end] = range;
      for (let i = Math.min(start, end); i <= Math.max(start, end); i++) lines.add(i);
    } else {
      range.forEach((n) => lines.add(n));
    }
    return lines;
  }

  for (const part of range.split(',')) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const rangeMatch = trimmed.match(/^(\d+)\s*-\s*(\d+)$/);
    if (rangeMatch) {
      const start = parseInt(rangeMatch[1], 10);
      const end = parseInt(rangeMatch[2], 10);
      for (let i = Math.min(start, end); i <= Math.max(start, end); i++) lines.add(i);
    } else if (/^\d+$/.test(trimmed)) {
      lines.add(parseInt(trimmed, 10));
    }
  }
  return lines;
}

/**
 * Splits hljs's highlighted HTML back into per-line HTML while keeping span
 * tags balanced across line breaks (e.g. a token that wraps a multi-line comment).
 */
function splitHighlightedHtml(html: string): string[] {
  const container = document.createElement('div');
  container.innerHTML = html;

  const lines: string[] = [''];
  const openTags: string[] = [];

  const escapeText = (text: string) =>
    text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  const appendToCurrentLine = (chunk: string) => {
    lines[lines.length - 1] += chunk;
  };

  const walk = (node: ChildNode) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const parts = (node.textContent ?? '').split('\n');
      parts.forEach((part, i) => {
        appendToCurrentLine(escapeText(part));
        if (i < parts.length - 1) {
          appendToCurrentLine(openTags.map(() => '</span>').join(''));
          lines.push('');
          appendToCurrentLine(openTags.join(''));
        }
      });
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      const className = el.getAttribute('class');
      const openTag = className ? `<span class="${className}">` : '<span>';
      appendToCurrentLine(openTag);
      openTags.push(openTag);
      el.childNodes.forEach(walk);
      openTags.pop();
      appendToCurrentLine('</span>');
    }
  };

  container.childNodes.forEach(walk);
  return lines;
}

@Component({
  selector: 'app-code-snippet',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './code-snippet.component.html',
  styleUrl: './code-snippet.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CodeSnippetComponent implements OnChanges {
  @Input() body: string | null = null;
  @Input() language: string | null = null;
  @Input() lineRange: string | number[] | null = null;
  /** 'default' shows a line-number gutter for calling out ranges; 'output' is a compact block for run results. */
  @Input() variant: 'default' | 'output' = 'default';

  lines: CodeLine[] = [];

  constructor(private sanitizer: DomSanitizer) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('body' in changes || 'language' in changes || 'lineRange' in changes) {
      this.lines = this.buildLines();
    }
  }

  private buildLines(): CodeLine[] {
    const body = this.body ?? '';
    if (!body) return [];

    const highlightedSet = this.lineRange ? parseLineRange(this.lineRange) : new Set<number>();
    const lang = this.language?.trim().toLowerCase() || '';
    const known = !!lang && hljs.getLanguage(lang) !== undefined;

    const rawLines = body.split('\n');
    const htmlLines = known
      ? splitHighlightedHtml(hljs.highlight(body, { language: lang, ignoreIllegals: true }).value)
      : rawLines.map((line) =>
          line.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'),
        );

    return rawLines.map((_, i) => ({
      num: i + 1,
      html: this.sanitizer.bypassSecurityTrustHtml(htmlLines[i] ?? ''),
      highlighted: highlightedSet.has(i + 1),
    }));
  }
}