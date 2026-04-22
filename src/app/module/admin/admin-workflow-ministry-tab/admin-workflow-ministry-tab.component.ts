import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminBusinessPlanWorkflowService } from '@/app/core/service/admin-business-plan-workflow.service';

const REJECTION_REASONS = [
  'Does not align with cooperative bylaws',
  'Financial projections unrealistic',
  'Environmental safeguards insufficient',
  'Other (see comments)'
];

@Component({
  selector: 'app-admin-workflow-ministry-tab',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-workflow-ministry-tab.component.html',
  styleUrl: './admin-workflow-ministry-tab.component.scss',
})
export class AdminWorkflowMinistryTabComponent {
  readonly workflow = inject(AdminBusinessPlanWorkflowService);

  readonly REJECTION_REASONS = REJECTION_REASONS;
  readonly reasonByPlan = signal<Record<string, string>>({});
  readonly commentByPlan = signal<Record<string, string>>({});
  readonly rowErrorByPlan = signal<Record<string, string>>({});

  constructor() {
    this.reasonByPlan.set(Object.fromEntries(this.workflow.ministryQueue().map((plan) => [plan.id, REJECTION_REASONS[0]])));
  }

  setReason(planId: string, reason: string): void {
    this.reasonByPlan.update((existing) => ({ ...existing, [planId]: reason }));
  }

  setComment(planId: string, comment: string): void {
    this.commentByPlan.update((existing) => ({ ...existing, [planId]: comment }));
  }

  reject(planId: string): void {
    const reason = this.reasonByPlan()[planId] ?? REJECTION_REASONS[0];
    const comment = this.commentByPlan()[planId] ?? '';
    const result = this.workflow.rejectByMinistry(planId, reason, comment);

    this.rowErrorByPlan.update((existing) => ({ ...existing, [planId]: result.ok ? '' : (result.reason ?? 'Unable to reject plan.') }));
    if (result.ok) {
      this.commentByPlan.update((existing) => ({ ...existing, [planId]: '' }));
    }
  }
}
