import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

type ProgressRow = {
  id: string;
  acCode: string;
  acName: string;
  province: string;
  planYear: string;
  milestone: string;
  period: string;
  pct: number;
  activities: string;
  resources: string;
  challenges: string;
  attachments: number;
};

@Component({
  selector: 'app-progress-reporting-admin-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './progress-reporting-admin-page.component.html',
  styleUrl: './progress-reporting-admin-page.component.scss',
})
export class ProgressReportingAdminPageComponent {
  readonly periodMode = signal<'all' | 'quarterly' | 'monthly'>('all');

  readonly rows: ProgressRow[] = [
    {
      id: 'pu-1',
      acCode: 'AC-BB-2024-157',
      acName: 'Prasat Sambor Rung Roeang Modern AC',
      province: 'Kampong Thom',
      planYear: '2026',
      milestone: 'M3 — Input bundling & training',
      period: '2026-Q1',
      pct: 72,
      activities: '2 field schools, 1 demo plot visit',
      resources: 'Seed co-fund 62%, extension days 18',
      challenges: 'Delayed fertilizer delivery (2 weeks)',
      attachments: 4
    },
    {
      id: 'pu-2',
      acCode: 'AC-KT-2025-012',
      acName: 'Stueng Saen Horticulture AC',
      province: 'Kampong Thom',
      planYear: '2026',
      milestone: 'M1 — Nursery establishment',
      period: '2026-03 (monthly)',
      pct: 55,
      activities: 'Shade net repair, seedling count QA',
      resources: 'Labor 120 person-days, water 14 tankers',
      challenges: 'Staff illness — temporary gap',
      attachments: 2
    },
    {
      id: 'pu-3',
      acCode: 'AC-SR-2023-088',
      acName: 'Angkor Fresh Vegetables Cooperative',
      province: 'Siem Reap',
      planYear: '2025',
      milestone: 'M5 — Market linkage',
      period: '2025-Q4',
      pct: 88,
      activities: '3 buyer meetings, cold chain trial',
      resources: 'Transport grant drawdown 40%',
      challenges: 'Price volatility on leafy greens',
      attachments: 6
    }
  ];

  readonly visibleRows = computed(() => {
    const mode = this.periodMode();
    if (mode === 'all') return this.rows;
    if (mode === 'quarterly') return this.rows.filter((row) => row.period.includes('Q'));
    return this.rows.filter((row) => row.period.toLowerCase().includes('monthly'));
  });
}
