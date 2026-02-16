import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { HeatmapService, HeatmapDay } from '@services/heatmap/heatmap.service';

type HeatmapCell = {
  date: Date | null;
  iso: string | null; // YYYY-MM-DD
  count: number;
  level: 0 | 1 | 2 | 3 | 4 | 5;
};

@Component({
  selector: 'app-heatmap-small',
  standalone: true,
  imports: [NgFor, NgIf, AsyncPipe],
  templateUrl: './heatmap-small.html',
  styleUrl: './heatmap-small.scss',
})
export class HeatmapSmall implements OnInit, OnChanges {
  @Input() days = 28;
  @Input() daysData: HeatmapDay[] | null = null;

  readonly weekdayLabels = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  cells: HeatmapCell[] = [];
  columns = 4;

  loading$!: Observable<HeatmapDay[]>;

  constructor(private readonly heatmapService: HeatmapService) {}

  ngOnInit(): void {
    if (!this.daysData) {
      this.loading$ = this.heatmapService.getSubmissionHeatmap(this.days);
      this.loading$.subscribe((data) => this.build(data));
    } else {
      this.build(this.daysData);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['daysData'] && this.daysData) {
      this.build(this.daysData);
    }

    if (changes['days'] && !this.daysData) {
      this.loading$ = this.heatmapService.getSubmissionHeatmap(this.days);
      this.loading$.subscribe((data) => this.build(data));
    }
  }

  private build(data: HeatmapDay[]): void {
    // Always show a 4x7 grid (28 cells) for the small heatmap
    this.columns = 4;

    const today = this.startOfDay(new Date());

    // Anchor grid to weekday rows (MON..SUN) with exactly 4 columns:
    // start = Monday of this week minus 3 weeks
    const startOfThisWeek = this.startOfWeekMonday(today);
    const gridStart = new Date(startOfThisWeek);
    gridStart.setDate(startOfThisWeek.getDate() - 21); // 3 weeks back

    const countByIso = new Map<string, number>();
    for (const d of data) countByIso.set(d.date, d.count);

    const maxCount = Math.max(0, ...Array.from(countByIso.values()));
    const slots: HeatmapCell[] = [];

    // Fill 28 days, column-major by calendar week (Mon..Sun per column)
    for (let i = 0; i < 28; i++) {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + i);

      // Don’t show future days inside the current week
      if (date.getTime() > today.getTime()) {
        slots.push({ date: null, iso: null, count: 0, level: 0 });
        continue;
      }

      const iso = this.toIsoDate(date);
      const count = countByIso.get(iso) ?? 0;
      const level = this.countToLevel(count, maxCount);

      slots.push({ date, iso, count, level });
    }

    this.cells = slots;
  }

  private countToLevel(count: number, maxCount: number): 0 | 1 | 2 | 3 | 4 | 5 {
    if (!count || maxCount <= 0) return 0;
    const ratio = count / maxCount;
    const scaled = Math.ceil(ratio * 5);
    return Math.max(1, Math.min(5, scaled)) as 1 | 2 | 3 | 4 | 5;
  }

  private startOfWeekMonday(d: Date): Date {
    const x = new Date(d);
    const mon0 = (x.getDay() + 6) % 7; // Mon=0..Sun=6
    x.setDate(x.getDate() - mon0);
    x.setHours(0, 0, 0, 0);
    return x;
  }

  private toIsoDate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  private startOfDay(d: Date): Date {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  }

  trackByIndex(i: number): number {
    return i;
  }

  cellAriaLabel(c: HeatmapCell): string {
    if (!c.iso) return 'Empty';
    return `${c.iso}: ${c.count} submissions`;
  }
}
