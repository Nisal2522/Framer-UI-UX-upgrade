import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

type CompareRow = {
  indicator: string;
  aTarget: string;
  aActual: string;
  bTarget: string;
  bActual: string;
};

@Component({
  selector: 'app-admin-workflow-compare-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-workflow-compare-tab.component.html',
  styleUrl: './admin-workflow-compare-tab.component.scss',
})
export class AdminWorkflowCompareTabComponent {
  readonly searchText = signal('');

  readonly rows: CompareRow[] = [
    {
      indicator: 'Member outreach (households)',
      aTarget: '320',
      aActual: '298',
      bTarget: '180',
      bActual: '172'
    },
    {
      indicator: 'Production volume (t)',
      aTarget: '1,200',
      aActual: '1,050',
      bTarget: '640',
      bActual: '610'
    },
    {
      indicator: 'Training sessions held',
      aTarget: '12',
      aActual: '11',
      bTarget: '8',
      bActual: '8'
    },
    {
      indicator: 'On-time milestone %',
      aTarget: '90%',
      aActual: '84%',
      bTarget: '88%',
      bActual: '82%'
    }
  ];

  readonly filteredRows = computed(() => {
    const q = this.searchText().trim().toLowerCase();
    if (!q) return this.rows;
    return this.rows.filter((row) => row.indicator.toLowerCase().includes(q));
  });
}
