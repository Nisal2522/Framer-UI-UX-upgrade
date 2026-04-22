import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminBusinessPlanWorkflowService } from '@/app/core/service/admin-business-plan-workflow.service';

@Component({
  selector: 'app-admin-workflow-support-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-workflow-support-tab.component.html',
  styleUrl: './admin-workflow-support-tab.component.scss',
})
export class AdminWorkflowSupportTabComponent {
  readonly workflow = inject(AdminBusinessPlanWorkflowService);

  readonly searchText = signal('');
  readonly revisionText = signal('');
  readonly errorMessage = signal('');

  readonly filteredQueue = computed(() => {
    const q = this.searchText().trim().toLowerCase();
    if (!q) return this.workflow.supportQueue();
    return this.workflow
      .supportQueue()
      .filter((plan) => [plan.title, plan.acCode, plan.chairman, plan.province].join(' ').toLowerCase().includes(q));
  });

  reviewedCount(plan: { sections: Array<{ reviewed: boolean }> }): number {
    return plan.sections.filter((s) => s.reviewed).length;
  }

  completionPct(plan: { sections: Array<{ reviewed: boolean }> }): number {
    const total = plan.sections.length;
    if (total === 0) return 0;
    return Math.round((this.reviewedCount(plan) / total) * 100);
  }

  requestRevision(planId: string): void {
    const text = this.revisionText().trim();
    if (!text) {
      this.errorMessage.set('Revision request requires mandatory comments.');
      return;
    }

    this.workflow.requestRevision(planId, text);
    this.revisionText.set('');
    this.errorMessage.set('');
  }

  forwardToMinistry(planId: string): void {
    const result = this.workflow.forwardToMinistry(planId);
    this.errorMessage.set(result.ok ? '' : (result.reason ?? 'Unable to forward plan.'));
  }
}
