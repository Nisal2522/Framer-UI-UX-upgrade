import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import type { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-admin-reporting-dashboard-page',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './admin-reporting-dashboard-page.component.html',
  styleUrl: './admin-reporting-dashboard-page.component.scss',
})
export class AdminReportingDashboardPageComponent {
  readonly profileData: ChartConfiguration<'bar'>['data'] = {
    labels: ['18–29', '30–44', '45–59', '60+'],
    datasets: [
      { label: 'Male', data: [12400, 18200, 15600, 9800], backgroundColor: '#0F2F8F', borderRadius: 4 },
      { label: 'Female', data: [10800, 16100, 13900, 8600], backgroundColor: '#E00025', borderRadius: 4 }
    ]
  };

  readonly youthData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Youth-led milestones', 'Mixed-age committees', 'No youth indicator'],
    datasets: [{ data: [34, 52, 14], backgroundColor: ['#0F2F8F', '#22C55E', '#F59E0B'] }]
  };

  readonly assetData: ChartConfiguration<'pie'>['data'] = {
    labels: ['Male-headed AC reporting', 'Female-headed AC reporting', 'Mixed / rotating'],
    datasets: [{ data: [54, 28, 18], backgroundColor: ['#0F2F8F', '#E00025', '#94A3B8'] }]
  };

  readonly trainingData: ChartConfiguration<'bar'>['data'] = {
    labels: ['GAP basics', 'Financial literacy', 'GESI mainstreaming', 'Post-harvest'],
    datasets: [
      { label: 'Male participants', data: [4200, 3100, 1800, 2900], backgroundColor: '#0F2F8F', borderRadius: 4 },
      { label: 'Female participants', data: [5100, 3800, 2400, 3200], backgroundColor: '#E00025', borderRadius: 4 }
    ]
  };

  readonly barOptions: ChartConfiguration<'bar'>['options'] = {
    maintainAspectRatio: false,
    scales: { y: { beginAtZero: true } },
    plugins: { legend: { display: true } }
  };

  readonly pieOptions: ChartConfiguration<'pie'>['options'] = {
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } }
  };
}
