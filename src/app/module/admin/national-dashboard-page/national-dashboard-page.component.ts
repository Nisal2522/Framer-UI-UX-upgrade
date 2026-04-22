import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import type { ChartConfiguration } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

type ProvinceData = {
  province: string;
  members: number;
  acs: number;
  approvalRate: number;
};

const PROVINCES: ProvinceData[] = [
  { province: 'Battambang', members: 12400, acs: 118, approvalRate: 84 },
  { province: 'Siem Reap', members: 10100, acs: 96, approvalRate: 80 },
  { province: 'Kampong Thom', members: 8900, acs: 84, approvalRate: 74 },
  { province: 'Kampong Cham', members: 8200, acs: 76, approvalRate: 73 },
  { province: 'Takeo', members: 6400, acs: 62, approvalRate: 70 },
  { province: 'Kandal', members: 9800, acs: 92, approvalRate: 79 }
];

const MEMBER_TREND = [118200, 119400, 120800, 122100, 123500, 124800, 126200, 127400, 128600, 129800, 131000, 132400];

@Component({
  selector: 'app-national-dashboard-page',
  standalone: true,
  imports: [CommonModule, FormsModule, BaseChartDirective],
  templateUrl: './national-dashboard-page.component.html',
  styleUrl: './national-dashboard-page.component.scss',
})
export class NationalDashboardPageComponent implements OnInit {
  @Input() fixedProvince: string | null = null;
  @Input() scopeLabel = 'National Dashboard';

  readonly provinces = PROVINCES;
  readonly provinceFilter = signal('All');

  readonly dashboardTitle = computed(() =>
    this.provinceFilter() === 'All' ? this.scopeLabel : `${this.scopeLabel} — ${this.provinceFilter()}`
  );

  readonly filteredProvinceRows = computed(() => {
    if (this.provinceFilter() === 'All') return this.provinces;
    return this.provinces.filter((row) => row.province === this.provinceFilter());
  });

  readonly kpis = computed(() => {
    const rows = this.filteredProvinceRows();
    const members = rows.reduce((sum, row) => sum + row.members, 0);
    const acs = rows.reduce((sum, row) => sum + row.acs, 0);
    const avgApproval = rows.length === 0 ? 0 : Math.round(rows.reduce((sum, row) => sum + row.approvalRate, 0) / rows.length);
    const submitted = rows.length === 0 ? 0 : Math.round(rows.reduce((sum, row) => sum + row.acs * 0.8, 0));

    return [
      { label: 'Active ACs', value: acs.toLocaleString(), hint: 'Registered cooperatives in scope' },
      { label: 'Members enrolled', value: members.toLocaleString(), hint: 'Illustrative enrollment' },
      { label: 'Plans submitted', value: submitted.toLocaleString(), hint: 'Current cycle submissions' },
      { label: 'Approval rate', value: `${avgApproval}%`, hint: 'Support + ministry outcomes' }
    ];
  });

  readonly membershipChartData = computed<ChartConfiguration<'line'>['data']>(() => {
    const scale = this.provinceFilter() === 'All' ? 1 : 0.12;
    const values = MEMBER_TREND.map((value) => Math.round(value * scale));
    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      datasets: [
        {
          label: this.provinceFilter() === 'All' ? 'National enrolled' : `${this.provinceFilter()} enrolled`,
          data: values,
          borderColor: '#0F2F8F',
          backgroundColor: 'rgba(15,47,143,0.12)',
          fill: true,
          tension: 0.35,
          pointRadius: 2
        }
      ]
    };
  });

  readonly approvalChartData = computed<ChartConfiguration<'bar'>['data']>(() => ({
    labels: this.filteredProvinceRows().map((row) => row.province),
    datasets: [
      {
        label: 'Approval rate (%)',
        data: this.filteredProvinceRows().map((row) => row.approvalRate),
        backgroundColor: '#1A365D',
        borderRadius: 6
      }
    ]
  }));

  readonly distributionChartData = computed<ChartConfiguration<'doughnut'>['data']>(() => ({
    labels: this.filteredProvinceRows().map((row) => row.province),
    datasets: [
      {
        data: this.filteredProvinceRows().map((row) => row.acs),
        backgroundColor: ['#0F2F8F', '#3B5FCC', '#22C55E', '#F59E0B', '#E00025', '#94A3B8']
      }
    ]
  }));

  readonly lineChartOptions: ChartConfiguration<'line'>['options'] = {
    maintainAspectRatio: false,
    plugins: { legend: { display: true } },
    scales: { y: { beginAtZero: false } }
  };

  readonly barChartOptions: ChartConfiguration<'bar'>['options'] = {
    maintainAspectRatio: false,
    indexAxis: 'y',
    scales: { x: { min: 0, max: 100 } },
    plugins: { legend: { display: false } }
  };

  readonly doughnutOptions: ChartConfiguration<'doughnut'>['options'] = {
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom' } }
  };

  ngOnInit(): void {
    if (this.fixedProvince) {
      this.provinceFilter.set(this.fixedProvince);
    }
  }

  setProvinceFilter(value: string): void {
    if (this.fixedProvince) return;
    this.provinceFilter.set(value);
  }
}
