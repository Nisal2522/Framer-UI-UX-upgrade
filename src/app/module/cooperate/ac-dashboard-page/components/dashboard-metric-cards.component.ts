import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type DashboardMetricCard = {
  label: string;
  icon: string;
  value: string;
  subtext?: string;
  badge?: string;
};

@Component({
  selector: 'app-dashboard-metric-cards',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-metric-cards.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardMetricCardsComponent {
  readonly cards = input.required<DashboardMetricCard[]>();
}

