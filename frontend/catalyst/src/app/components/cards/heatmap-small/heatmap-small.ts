import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { Observable, Subscription } from 'rxjs';
import { HeatmapDay, HeatmapService } from '@services/heatmap/heatmap.service';

type HeatmapLayout = 'portrait' | 'landscape';
type HeatmapLevel = 0 | 1 | 2 | 3 | 4;

type HeatmapCell = {
  date: Date | null;
  iso: string | null;
  count: number;
  level: HeatmapLevel;
  tooltipDate: string;
  tooltipText: string;
};

type PortraitRow = {
  label: string;
  cells: HeatmapCell[];
};

@Component({
  selector: 'app-heatmap-small',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './heatmap-small.html',
  styleUrl: './heatmap-small.scss',
})
export class HeatmapSmall implements OnInit, OnChanges, AfterViewInit, OnDestroy {
  @Input() days = 28;
  @Input() daysData: HeatmapDay[] | null = null;
  @Input() layout: HeatmapLayout = 'portrait';

  @HostBinding('style.--cell-size.px') cellSize = 24;
  @HostBinding('style.--label-col-size.px') labelColSize = 32;
  @HostBinding('style.--label-row-size.px') labelRowSize = 22;

  readonly weekdayLabels = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];

  cells: HeatmapCell[] = [];
  weekRows: HeatmapCell[][] = [];
  portraitRows: PortraitRow[] = [];

  loading$!: Observable<HeatmapDay[]>;

  private fetchSub?: Subscription;
  private resizeObserver?: ResizeObserver;
  private rafId = 0;

  constructor(
    private readonly heatmapService: HeatmapService,
    private readonly elRef: ElementRef<HTMLElement>,
    private readonly ngZone: NgZone
  ) {}

  ngOnInit(): void {
    this.loadOrBuild();
  }

  ngAfterViewInit(): void {
    this.ngZone.runOutsideAngular(() => {
      this.resizeObserver = new ResizeObserver(() => {
        cancelAnimationFrame(this.rafId);
        this.rafId = requestAnimationFrame(() => this.updateSizing());
      });

      this.resizeObserver.observe(this.elRef.nativeElement);
    });

    queueMicrotask(() => this.updateSizing());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['daysData'] || changes['days']) {
      this.loadOrBuild();
    }

    if (changes['layout']) {
      queueMicrotask(() => this.updateSizing());
    }
  }

  ngOnDestroy(): void {
    this.fetchSub?.unsubscribe();
    this.resizeObserver?.disconnect();
    cancelAnimationFrame(this.rafId);
  }

  private loadOrBuild(): void {
    this.fetchSub?.unsubscribe();

    if (this.daysData) {
      this.build(this.daysData);
      queueMicrotask(() => this.updateSizing());
      return;
    }

    this.loading$ = this.heatmapService.getSubmissionHeatmap(this.days);
    this.fetchSub = this.loading$.subscribe((data) => {
      this.build(data);
      queueMicrotask(() => this.updateSizing());
    });
  }

  private build(data: HeatmapDay[]): void {
    const totalDays = 28;
    const today = this.startOfDay(new Date());

    const startOfThisWeek = this.startOfWeekMonday(today);
    const gridStart = new Date(startOfThisWeek);
    gridStart.setDate(startOfThisWeek.getDate() - 21);

    const countByIso = new Map<string, number>();
    for (const d of data) {
      countByIso.set(d.date, d.count);
    }

    const maxCount = Math.max(0, ...Array.from(countByIso.values()));
    const slots: HeatmapCell[] = [];

    for (let i = 0; i < totalDays; i++) {
      const date = new Date(gridStart);
      date.setDate(gridStart.getDate() + i);

      if (date.getTime() > today.getTime()) {
        slots.push({
          date: null,
          iso: null,
          count: 0,
          level: 0,
          tooltipDate: '',
          tooltipText: '',
        });
        continue;
      }

      const iso = this.toIsoDate(date);
      const count = countByIso.get(iso) ?? 0;

      slots.push({
        date,
        iso,
        count,
        level: this.countToLevel(count, maxCount),
        tooltipDate: this.formatDate(date),
        tooltipText: `${count} submission${count === 1 ? '' : 's'}`,
      });
    }

    this.cells = slots;

    this.weekRows = Array.from({ length: 4 }, (_, weekIndex) =>
      slots.slice(weekIndex * 7, weekIndex * 7 + 7)
    );

    this.portraitRows = this.weekdayLabels.map((label, dayIndex) => ({
      label,
      cells: this.weekRows.map((week) => week[dayIndex]),
    }));
  }

  private updateSizing(): void {
    const host = this.elRef.nativeElement;
    const heatmap = host.querySelector('.heatmap') as HTMLElement | null;

    if (!heatmap) return;

    const styles = getComputedStyle(heatmap);
    const paddingTop = parseFloat(styles.paddingTop) || 0;
    const paddingBottom = parseFloat(styles.paddingBottom) || 0;
    const gap = parseFloat(styles.getPropertyValue('--hm-gap')) || 8;

    const innerHeight = Math.max(0, heatmap.clientHeight - paddingTop - paddingBottom);

    if (this.layout === 'portrait') {
      const rows = 7;
      const cell = Math.floor((innerHeight - gap * (rows - 1)) / rows);
      this.cellSize = Math.max(12, cell);
      this.labelColSize = Math.max(28, Math.round(this.cellSize * 1.35));
    } else {
      const labelFactor = 0.9;
      const totalUnits = 4 + labelFactor;
      const totalGaps = 4;
      const cell = Math.floor((innerHeight - gap * totalGaps) / totalUnits);
      this.cellSize = Math.max(12, cell);
      this.labelRowSize = Math.max(20, Math.round(this.cellSize * labelFactor));
    }
  }

  private countToLevel(count: number, maxCount: number): HeatmapLevel {
    if (!count || maxCount <= 0) return 0;
    const ratio = count / maxCount;
    const scaled = Math.ceil(ratio * 4);
    return Math.max(1, Math.min(4, scaled)) as HeatmapLevel;
  }

  private startOfWeekMonday(d: Date): Date {
    const x = new Date(d);
    const mon0 = (x.getDay() + 6) % 7;
    x.setDate(x.getDate() - mon0);
    x.setHours(0, 0, 0, 0);
    return x;
  }

  private startOfDay(d: Date): Date {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    return x;
  }

  private toIsoDate(d: Date): string {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  formatDate(d: Date): string {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  }

  trackByIndex(index: number): number {
    return index;
  }

  cellAriaLabel(cell: HeatmapCell): string {
    if (!cell.iso || !cell.date) return 'No data';
    return `${this.formatDate(cell.date)}: ${cell.count} submission${cell.count === 1 ? '' : 's'}`;
  }
}
