import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { AdminBusinessPlanWorkflowService } from '@/app/core/service/admin-business-plan-workflow.service';

@Component({
  selector: 'app-admin-workflow-history-tab',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-workflow-history-tab.component.html',
  styleUrl: './admin-workflow-history-tab.component.scss',
})
export class AdminWorkflowHistoryTabComponent {
  readonly workflow = inject(AdminBusinessPlanWorkflowService);
  readonly expandedPlanIds = signal<string[]>([]);

  toggle(planId: string): void {
    this.expandedPlanIds.update((ids) => (ids.includes(planId) ? ids.filter((id) => id !== planId) : [...ids, planId]));
  }

  isOpen(planId: string): boolean {
    return this.expandedPlanIds().includes(planId);
  }
}
