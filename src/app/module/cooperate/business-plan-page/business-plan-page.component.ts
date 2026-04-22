import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

type PlanStatus = 'Approved' | 'Under Review' | 'Rejected' | 'Draft';
type PlanRow = {
  id: string;
  title: string;
  status: PlanStatus;
  submittedDate: string | null;
  approvedDate: string | null;
  budget: string;
  progress: number;
  reviewer: string;
};

type Section = {
  id: string;
  number: string;
  title: string;
  subsections?: { id: string; number: string; title: string }[];
};

const PAST_PLANS: PlanRow[] = [
  {
    id: 'BP-2025-001',
    title: 'Agricultural Growth Plan 2025',
    status: 'Draft',
    submittedDate: null,
    approvedDate: null,
    budget: '$55,000',
    progress: 0,
    reviewer: 'Not Assigned'
  },
  {
    id: 'BP-2023-001',
    title: 'Rice Production Expansion 2023',
    status: 'Approved',
    submittedDate: '2023-02-10',
    approvedDate: '2023-03-01',
    budget: '$42,000',
    progress: 100,
    reviewer: 'Ministry Committee'
  },
  {
    id: 'BP-2022-047',
    title: 'Organic Certification Drive 2022',
    status: 'Approved',
    submittedDate: '2022-04-15',
    approvedDate: '2022-05-20',
    budget: '$19,500',
    progress: 100,
    reviewer: 'Business Plan Support Team'
  },
  {
    id: 'BP-2023-089',
    title: 'Irrigation Infrastructure Upgrade',
    status: 'Rejected',
    submittedDate: '2023-09-05',
    approvedDate: null,
    budget: '$67,000',
    progress: 0,
    reviewer: 'Ministry Committee'
  },
  {
    id: 'BP-2024-015',
    title: 'Climate-Resilient Farming Initiative',
    status: 'Approved',
    submittedDate: '2024-02-20',
    approvedDate: '2024-03-05',
    budget: '$62,000',
    progress: 42,
    reviewer: 'Ministry Committee'
  },
  {
    id: 'BP-2024-042',
    title: 'Organic Vegetable Production',
    status: 'Under Review',
    submittedDate: '2024-03-10',
    approvedDate: null,
    budget: '$28,500',
    progress: 0,
    reviewer: 'Business Plan Support Team'
  }
];

const PLAN_PREFILL_BY_ID: Record<string, Record<string, string>> = {
  'BP-2025-001': {
    '1.1': 'Prasat Sambor Rung Roeang Modern AC is a farmer-led cooperative focused on rice and mixed-crop production in Kampong Thom.',
    '1.2': 'We aggregate produce, provide member services, and coordinate input purchasing for 447 active members.',
    '2.1': '2025 objective: improve productivity by 12% while reducing post-harvest losses through better handling.',
    '2.2': 'Primary buyers include district millers and two provincial wholesalers under seasonal agreements.',
    '2.3': 'Estimated annual budget: $55,000 with co-financing from member contributions and retained surplus.',
    '2.4': 'Key milestones include irrigation schedule rollout, farmer training cycles, and quality checks by quarter.',
    '2.5': 'Top risks: weather variability, pest pressure, and transport disruptions during peak season.',
    '2.6': 'Plan follows environmental safeguards, efficient water use, and inclusive participation targets.',
    '2.7': 'Progress tracked monthly using yield, member participation, and financial performance indicators.',
    '2.8': 'After review approval, implementation begins with procurement and training mobilization.',
    '3.1': 'Investment request prioritizes productivity assets aligned with approved business activities.',
    '3.2': 'Asset list includes irrigation upgrades, storage improvements, and quality control tools.',
    '3.3': 'Members contribute labor, in-kind materials, and partial cost sharing where feasible.',
    '3.4': 'Maintenance plan assigns custodians and quarterly servicing schedules for all assets.',
    '3.5': 'Safeguards ensure equitable access for women, youth, and vulnerable member households.',
    '3.6': 'Committee confirms accountability and signs implementation commitments.',
    '4': 'Annexes include member registry summary, market assumptions, and costing worksheets.'
  }
};

@Component({
  selector: 'app-business-plan-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './business-plan-page.component.html',
  styleUrl: './business-plan-page.component.scss',
})
export class BusinessPlanPageComponent {
  @ViewChild('exportContentRef') exportContentRef?: ElementRef<HTMLDivElement>;
  private readonly router = inject(Router);

  readonly pastPlans = PAST_PLANS;
  readonly sections: Section[] = [
    {
      id: '1',
      number: '1',
      title: 'COOPERATIVE PROFILE',
      subsections: [
        { id: '1.1', number: '1.1', title: 'WHO WE ARE' },
        { id: '1.2', number: '1.2', title: 'WHAT WE DO' }
      ]
    },
    {
      id: '2',
      number: '2',
      title: 'BUSINESS PLAN',
      subsections: [
        { id: '2.1', number: '2.1', title: 'BUSINESS OVERVIEW' },
        { id: '2.2', number: '2.2', title: 'OUR MARKET & BUYERS' },
        { id: '2.3', number: '2.3', title: 'FINANCE' },
        { id: '2.4', number: '2.4', title: 'IMPLEMENTATION PLAN' },
        { id: '2.5', number: '2.5', title: 'MANAGING RISKS' },
        { id: '2.6', number: '2.6', title: 'ENVIRONMENT & SOCIAL RESPONSIBILITY' },
        { id: '2.7', number: '2.7', title: "HOW WE'LL TRACK PROGRESS" },
        { id: '2.8', number: '2.8', title: 'WHAT HAPPENS NEXT?' }
      ]
    },
    {
      id: '3',
      number: '3',
      title: 'INVESTMENT PLAN',
      subsections: [
        { id: '3.1', number: '3.1', title: 'APPLICATION SUMMARY' },
        { id: '3.2', number: '3.2', title: 'ASSET DETAILS' },
        { id: '3.3', number: '3.3', title: 'CONTRIBUTION OF MEMBERS' },
        { id: '3.4', number: '3.4', title: 'MAINTENANCE OF THE EQUIPMENT' },
        { id: '3.5', number: '3.5', title: 'SAFEGUARDS & ACCESS' },
        { id: '3.6', number: '3.6', title: 'COMMITMENTS & APPROVAL' }
      ]
    },
    { id: '4', number: '4', title: 'ANNEXES', subsections: [] }
  ];

  readonly historySearch = signal('');
  readonly historyStatusFilter = signal('All');
  readonly expandedSections = signal<string[]>(['1']);
  readonly expandedSubsections = signal<string[]>([]);
  readonly completedSections = signal<string[]>(['1']);
  readonly isExportingPdf = signal(false);
  readonly sectionContent = signal<Record<string, string>>({});

  readonly selectedPlan = signal<PlanRow | null>((history.state?.fromPlan ?? null) as PlanRow | null);
  readonly isNewPlan = signal(this.router.url.endsWith('/new'));

  readonly approvedCount = computed(() => this.pastPlans.filter((p) => p.status === 'Approved').length);
  readonly reviewCount = computed(() => this.pastPlans.filter((p) => p.status === 'Under Review').length);
  readonly rejectedCount = computed(() => this.pastPlans.filter((p) => p.status === 'Rejected').length);
  readonly completedCount = computed(() => this.completedSections().length);
  readonly completionPct = computed(() => Math.round((this.completedCount() / this.sections.length) * 100));

  readonly filteredPastPlans = computed(() => {
    const q = this.historySearch().trim().toLowerCase();
    const status = this.historyStatusFilter();
    return this.pastPlans.filter((p) => {
      const matchesSearch = !q || p.title.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
      const matchesStatus = status === 'All' || p.status === status;
      return matchesSearch && matchesStatus;
    });
  });

  constructor() {
    const prefill = this.selectedPlan() ? PLAN_PREFILL_BY_ID[this.selectedPlan()!.id] ?? {} : {};
    this.sectionContent.set(prefill);
  }

  navigateNew(): void {
    this.router.navigateByUrl('/dashboard/business-plans/new');
    this.isNewPlan.set(true);
  }

  navigateHistory(): void {
    this.router.navigateByUrl('/dashboard/business-plans');
    this.isNewPlan.set(false);
  }

  openPlan(plan: PlanRow): void {
    this.router.navigateByUrl('/dashboard/business-plans/new', { state: { fromPlan: plan } });
    this.selectedPlan.set(plan);
    this.sectionContent.set(PLAN_PREFILL_BY_ID[plan.id] ?? {});
    this.isNewPlan.set(true);
  }

  toggleSection(id: string): void {
    this.expandedSections.update((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  }

  toggleSubsection(id: string): void {
    this.expandedSubsections.update((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  }

  toggleCompletedSection(id: string): void {
    this.completedSections.update((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  }

  expandAllSections(): void {
    this.expandedSections.set(this.sections.map((s) => s.id));
  }

  collapseAllSections(): void {
    this.expandedSections.set([]);
    this.expandedSubsections.set([]);
  }

  setSectionContent(key: string, value: string): void {
    this.sectionContent.update((prev) => ({ ...prev, [key]: value }));
  }

  async exportPdf(): Promise<void> {
    if (!this.exportContentRef?.nativeElement || this.isExportingPdf()) return;
    this.isExportingPdf.set(true);
    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import('html2canvas'), import('jspdf')]);
      const canvas = await html2canvas(this.exportContentRef.nativeElement, { scale: 2, useCORS: true, backgroundColor: '#ffffff' });
      const imageData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const imageWidth = pageWidth;
      const imageHeight = (canvas.height * imageWidth) / canvas.width;
      let heightLeft = imageHeight;
      let position = 0;
      pdf.addImage(imageData, 'PNG', 0, position, imageWidth, imageHeight);
      heightLeft -= pageHeight;
      while (heightLeft > 0) {
        position = heightLeft - imageHeight;
        pdf.addPage();
        pdf.addImage(imageData, 'PNG', 0, position, imageWidth, imageHeight);
        heightLeft -= pageHeight;
      }
      const date = new Date().toISOString().slice(0, 10);
      pdf.save(`business-plan-${date}.pdf`);
    } catch (error) {
      console.error('Failed to export business plan PDF:', error);
    } finally {
      this.isExportingPdf.set(false);
    }
  }
}
