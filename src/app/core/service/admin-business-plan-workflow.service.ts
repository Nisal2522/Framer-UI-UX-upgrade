import { Injectable, computed, signal } from '@angular/core';
import { NotificationService } from '@/app/core/service/notification.service';

export type PlanStatus =
  | 'submitted_support'
  | 'revision_requested'
  | 'pending_ministry'
  | 'approved'
  | 'rejected';

export type PlanSection = {
  key: string;
  title: string;
  reviewed: boolean;
  comment: string;
};

export type Plan = {
  id: string;
  title: string;
  acCode: string;
  acName: string;
  chairman: string;
  planYear: string;
  coopType: string;
  province: string;
  status: PlanStatus;
  sections: PlanSection[];
};

export type HistoryRow = {
  id: string;
  at: string;
  actor: string;
  status: string;
  note: string;
  planId: string;
};

const INITIAL_PLANS: Plan[] = [
  {
    id: 'bp-1001',
    title: 'Business Plan FY 2026 — Rice & diversification',
    acCode: 'AC-BB-2024-157',
    acName: 'Prasat Sambor Rung Roeang Modern AC',
    chairman: 'Sok Pisey',
    planYear: '2026',
    coopType: 'Agricultural',
    province: 'Battambang',
    status: 'submitted_support',
    sections: [
      { key: 'coop_profile', title: 'Cooperative profile', reviewed: false, comment: '' },
      { key: 'business_plan', title: 'Business plan', reviewed: false, comment: '' },
      { key: 'investment_plan', title: 'Investment plan', reviewed: false, comment: '' },
      { key: 'annexes', title: 'Annexes', reviewed: false, comment: '' }
    ]
  },
  {
    id: 'bp-1002',
    title: 'Business Plan FY 2026 — Maize value chain',
    acCode: 'AC-KT-2024-091',
    acName: 'Stung Sen Agro Cooperative',
    chairman: 'Chhorn Dara',
    planYear: '2026',
    coopType: 'Agricultural',
    province: 'Kampong Thom',
    status: 'submitted_support',
    sections: [
      { key: 'coop_profile', title: 'Cooperative profile', reviewed: true, comment: 'Member profile checked.' },
      { key: 'business_plan', title: 'Business plan', reviewed: false, comment: '' },
      { key: 'investment_plan', title: 'Investment plan', reviewed: false, comment: '' },
      { key: 'annexes', title: 'Annexes', reviewed: false, comment: '' }
    ]
  },
  {
    id: 'bp-1003',
    title: 'Business Plan FY 2026 — Irrigation upgrade',
    acCode: 'AC-KD-2023-031',
    acName: 'Kandal Green Water Users AC',
    chairman: 'Vannak Kim',
    planYear: '2026',
    coopType: 'Agricultural',
    province: 'Kandal',
    status: 'revision_requested',
    sections: [
      { key: 'coop_profile', title: 'Cooperative profile', reviewed: true, comment: 'Legal docs completed.' },
      { key: 'business_plan', title: 'Business plan', reviewed: false, comment: 'Revise demand assumptions.' },
      { key: 'investment_plan', title: 'Investment plan', reviewed: false, comment: '' },
      { key: 'annexes', title: 'Annexes', reviewed: true, comment: 'Financial annex uploaded.' }
    ]
  },
  {
    id: 'bp-1004',
    title: 'Business Plan FY 2026 — Post-harvest handling',
    acCode: 'AC-KC-2022-204',
    acName: 'Mekong Harvest Cooperative',
    chairman: 'Srey Pov',
    planYear: '2026',
    coopType: 'Rice',
    province: 'Kampong Cham',
    status: 'pending_ministry',
    sections: [
      { key: 'coop_profile', title: 'Cooperative profile', reviewed: true, comment: '' },
      { key: 'business_plan', title: 'Business plan', reviewed: true, comment: '' },
      { key: 'investment_plan', title: 'Investment plan', reviewed: true, comment: '' },
      { key: 'annexes', title: 'Annexes', reviewed: true, comment: '' }
    ]
  },
  {
    id: 'bp-1005',
    title: 'Business Plan FY 2026 — Vegetable cold chain',
    acCode: 'AC-TO-2023-077',
    acName: 'Takeo FreshLink Cooperative',
    chairman: 'Sokha Ry',
    planYear: '2026',
    coopType: 'Horticulture',
    province: 'Takeo',
    status: 'pending_ministry',
    sections: [
      { key: 'coop_profile', title: 'Cooperative profile', reviewed: true, comment: '' },
      { key: 'business_plan', title: 'Business plan', reviewed: true, comment: '' },
      { key: 'investment_plan', title: 'Investment plan', reviewed: true, comment: '' },
      { key: 'annexes', title: 'Annexes', reviewed: true, comment: '' }
    ]
  }
];

const INITIAL_HISTORY: HistoryRow[] = [
  {
    id: 'h-1',
    at: '2026-03-20T11:00:00',
    actor: 'Support Team — Nget Bopha',
    status: 'Submitted → Support queue',
    note: 'Chairman submitted business plan package',
    planId: 'bp-1001'
  },
  {
    id: 'h-2',
    at: '2026-03-22T16:45:00',
    actor: 'Support Team — Nget Bopha',
    status: 'Forwarded to Ministry / FAO',
    note: 'All mandatory sections reviewed and passed',
    planId: 'bp-1004'
  },
  {
    id: 'h-3',
    at: '2026-03-24T14:10:00',
    actor: 'Ministry / FAO — Vanna Meas',
    status: 'Approved',
    note: 'Approved for FY 2026 implementation',
    planId: 'bp-1004'
  },
  {
    id: 'h-4',
    at: '2026-03-19T10:20:00',
    actor: 'Support Team — Somaly Chenda',
    status: 'Revision requested',
    note: 'Please revise market assumptions and procurement schedule',
    planId: 'bp-1003'
  }
];

@Injectable({ providedIn: 'root' })
export class AdminBusinessPlanWorkflowService {
  private readonly plansSubject = signal<Plan[]>(INITIAL_PLANS);
  private readonly historySubject = signal<HistoryRow[]>(INITIAL_HISTORY);

  readonly selectedPlanId = signal<string | null>(INITIAL_PLANS[0]?.id ?? null);

  readonly plans = this.plansSubject.asReadonly();
  readonly history = this.historySubject.asReadonly();

  readonly selectedPlan = computed(() =>
    this.plansSubject().find((plan) => plan.id === this.selectedPlanId()) ?? null
  );

  readonly supportQueue = computed(() =>
    this.plansSubject().filter((p) => p.status === 'submitted_support' || p.status === 'revision_requested')
  );

  readonly ministryQueue = computed(() => this.plansSubject().filter((p) => p.status === 'pending_ministry'));

  readonly historyByPlan = computed(() => {
    const map = new Map(this.plansSubject().map((p) => [p.id, p]));
    const grouped = new Map<string, HistoryRow[]>();

    for (const row of this.historySubject()) {
      const rows = grouped.get(row.planId) ?? [];
      rows.push(row);
      grouped.set(row.planId, rows);
    }

    return Array.from(grouped.entries())
      .map(([planId, rows]) => ({
        plan: map.get(planId) ?? null,
        rows: [...rows].sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime())
      }))
      .filter((entry) => entry.plan !== null)
      .sort((a, b) => {
        const aLast = a.rows[a.rows.length - 1]?.at ?? '';
        const bLast = b.rows[b.rows.length - 1]?.at ?? '';
        return new Date(bLast).getTime() - new Date(aLast).getTime();
      });
  });

  constructor(private readonly notifications: NotificationService) {}

  setSelectedPlan(planId: string | null): void {
    this.selectedPlanId.set(planId);
  }

  setSectionReviewed(planId: string, key: string, reviewed: boolean): void {
    this.updatePlan(planId, (plan) => ({
      ...plan,
      sections: plan.sections.map((section) => (section.key === key ? { ...section, reviewed } : section))
    }));
  }

  setSectionComment(planId: string, key: string, comment: string): void {
    this.updatePlan(planId, (plan) => ({
      ...plan,
      sections: plan.sections.map((section) => (section.key === key ? { ...section, comment } : section))
    }));
  }

  requestRevision(planId: string, comment: string): void {
    this.updatePlan(planId, (plan) => ({ ...plan, status: 'revision_requested' }));
    this.pushHistory({
      at: new Date().toISOString(),
      actor: 'Support Team',
      status: 'Revision requested',
      note: comment,
      planId
    });

    const plan = this.plansSubject().find((p) => p.id === planId);
    if (!plan) return;
    this.notifications.addNotification({
      title: `Plan ${plan.acCode}: Revision requested`,
      body: comment,
      audience: 'AC Committee & Support'
    });
  }

  forwardToMinistry(planId: string): { ok: boolean; reason?: string } {
    const plan = this.plansSubject().find((p) => p.id === planId);
    if (!plan) return { ok: false, reason: 'Plan not found.' };

    const allReviewed = plan.sections.every((section) => section.reviewed);
    if (!allReviewed) return { ok: false, reason: 'All sections must be reviewed before forwarding.' };

    this.updatePlan(planId, (existing) => ({ ...existing, status: 'pending_ministry' }));
    this.pushHistory({
      at: new Date().toISOString(),
      actor: 'Support Team',
      status: 'Pending Ministry / FAO approval',
      note: 'Forwarded for final decision',
      planId
    });
    this.notifications.addNotification({
      title: `Plan ${plan.acCode}: Pending Ministry / FAO approval`,
      body: 'Support review completed and forwarded.',
      audience: 'Support & Ministry'
    });

    return { ok: true };
  }

  approveByMinistry(planId: string): void {
    const plan = this.plansSubject().find((p) => p.id === planId);
    if (!plan) return;

    this.updatePlan(planId, (existing) => ({ ...existing, status: 'approved' }));
    this.pushHistory({
      at: new Date().toISOString(),
      actor: 'Ministry / FAO Committee',
      status: 'Approved',
      note: 'Final approval recorded',
      planId
    });
    this.notifications.addNotification({
      title: `Plan ${plan.acCode}: Approved`,
      body: 'Business plan approved and recorded.',
      audience: 'AC Committee & Support'
    });
  }

  rejectByMinistry(planId: string, reason: string, comment: string): { ok: boolean; reason?: string } {
    if (!comment.trim()) {
      return { ok: false, reason: 'Rejection requires a written explanation.' };
    }

    const plan = this.plansSubject().find((p) => p.id === planId);
    if (!plan) return { ok: false, reason: 'Plan not found.' };

    this.updatePlan(planId, (existing) => ({ ...existing, status: 'rejected' }));
    this.pushHistory({
      at: new Date().toISOString(),
      actor: 'Ministry / FAO Committee',
      status: 'Rejected',
      note: `${reason} — ${comment.trim()}`,
      planId
    });
    this.notifications.addNotification({
      title: `Plan ${plan.acCode}: Rejected`,
      body: `${reason}. ${comment.trim()}`,
      audience: 'AC Committee & Support'
    });

    return { ok: true };
  }

  private updatePlan(planId: string, updater: (plan: Plan) => Plan): void {
    this.plansSubject.update((plans) => plans.map((plan) => (plan.id === planId ? updater(plan) : plan)));
  }

  private pushHistory(row: Omit<HistoryRow, 'id'>): void {
    this.historySubject.update((rows) => [{ id: `h-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, ...row }, ...rows]);
  }
}
