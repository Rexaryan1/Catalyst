import { Component, OnInit, signal, computed, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataManagerService } from '@services/data-manager/data-manager.service';
import { DashboardData } from '../user-dashboard.component';

interface Segment {
  label: string;
  value: number;
  color: string;
  startAngle: number;
  endAngle: number;
  path: string;
  midAngle: number;
}

@Component({
  selector: 'donut-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './donut-chart.html',
  styleUrl: './donut-chart.scss',
})
export class DonutChart implements OnInit {
  private readonly COLORS = {
    easy:   '#AEFF95',
    medium: '#FFF6BF',
    hard:   '#FF9E97',
  };

  private readonly CX = 100;
  private readonly CY = 100;
  private readonly R_OUTER = 78;
  private readonly R_INNER = 54;
  private readonly R_HOVER = 84;

  breakdown = signal<{ easy: number; medium: number; hard: number }>({ easy: 0, medium: 0, hard: 0 });
  hoveredIndex = signal<number | null>(null);

  segments = computed<Segment[]>(() => {
    const b = this.breakdown();
    const items = [
      { label: 'Easy',   value: b.easy,   color: this.COLORS.easy },
      { label: 'Medium', value: b.medium, color: this.COLORS.medium },
      { label: 'Hard',   value: b.hard,   color: this.COLORS.hard },
    ];

    const total = items.reduce((s, i) => s + i.value, 0) || 1;
    const GAP_DEG = total === 0 ? 0 : 1.5; // small gap between sectors
    let cursor = -90; // start from top

    return items.map((item, idx) => {
      const slice = (item.value / total) * 360;
      const startAngle = cursor + GAP_DEG / 2;
      const endAngle   = cursor + slice - GAP_DEG / 2;
      cursor += slice;

      const midAngle = (startAngle + endAngle) / 2;

      const isHovered = this.hoveredIndex() === idx;
      const rOuter = isHovered ? this.R_HOVER : this.R_OUTER;

      return {
        label: item.label,
        value: item.value,
        color: item.color,
        startAngle,
        endAngle,
        midAngle,
        path: this.buildArcPath(startAngle, endAngle, rOuter, this.R_INNER),
      };
    });
  });

  constructor(private dataManagerService: DataManagerService) {}

  ngOnInit(): void {
    const cached = this.dataManagerService.snapshot<DashboardData>('dashboard');
    if (cached?.difficulty_breakdown) {
      this.breakdown.set(cached.difficulty_breakdown);
      return;
    }
    // Subscribe for when it arrives
    this.dataManagerService.get('api/user/dashboard', { withCredentials: true }).subscribe({
      next: (res: any) => {
        const b = res?.result?.difficulty_breakdown;
        if (b) this.breakdown.set(b);
      }
    });
  }

  private toRad(deg: number): number {
    return (deg * Math.PI) / 180;
  }

  private buildArcPath(startDeg: number, endDeg: number, rOuter: number, rInner: number): string {
    const cx = this.CX, cy = this.CY;
    const s = this.toRad(startDeg);
    const e = this.toRad(endDeg);
    const largeArc = endDeg - startDeg > 180 ? 1 : 0;

    const x1 = cx + rOuter * Math.cos(s);
    const y1 = cy + rOuter * Math.sin(s);
    const x2 = cx + rOuter * Math.cos(e);
    const y2 = cy + rOuter * Math.sin(e);
    const x3 = cx + rInner * Math.cos(e);
    const y3 = cy + rInner * Math.sin(e);
    const x4 = cx + rInner * Math.cos(s);
    const y4 = cy + rInner * Math.sin(s);

    return [
      `M ${x1} ${y1}`,
      `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${x2} ${y2}`,
      `L ${x3} ${y3}`,
      `A ${rInner} ${rInner} 0 ${largeArc} 0 ${x4} ${y4}`,
      'Z'
    ].join(' ');
  }

  onHover(idx: number): void  { this.hoveredIndex.set(idx); }
  onLeave(): void             { this.hoveredIndex.set(null); }

  total = computed<number>(() => {
    const b = this.breakdown();
    return b.easy + b.medium + b.hard;
  });
}
