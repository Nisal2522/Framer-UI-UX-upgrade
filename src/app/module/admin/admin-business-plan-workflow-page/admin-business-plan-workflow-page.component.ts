import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { AdminWorkflowCompareTabComponent } from '@/app/module/admin/admin-workflow-compare-tab/admin-workflow-compare-tab.component';
import { AdminWorkflowHistoryTabComponent } from '@/app/module/admin/admin-workflow-history-tab/admin-workflow-history-tab.component';
import { AdminWorkflowMinistryTabComponent } from '@/app/module/admin/admin-workflow-ministry-tab/admin-workflow-ministry-tab.component';
import { AdminWorkflowSupportTabComponent } from '@/app/module/admin/admin-workflow-support-tab/admin-workflow-support-tab.component';

type WorkflowTab = 'support' | 'ministry' | 'history' | 'compare';

@Component({
  selector: 'app-admin-business-plan-workflow-page',
  standalone: true,
  imports: [
    CommonModule,
    AdminWorkflowSupportTabComponent,
    AdminWorkflowMinistryTabComponent,
    AdminWorkflowHistoryTabComponent,
    AdminWorkflowCompareTabComponent
  ],
  templateUrl: './admin-business-plan-workflow-page.component.html',
  styleUrl: './admin-business-plan-workflow-page.component.scss',
})
export class AdminBusinessPlanWorkflowPageComponent {
  readonly activeTab = signal<WorkflowTab>('support');

  readonly tabs: Array<{ id: WorkflowTab; label: string }> = [
    { id: 'support', label: 'Support Team Review' },
    { id: 'ministry', label: 'Ministry / FAO Decision' },
    { id: 'history', label: 'Approval History' },
    { id: 'compare', label: 'Plan Comparison' }
  ];
}
