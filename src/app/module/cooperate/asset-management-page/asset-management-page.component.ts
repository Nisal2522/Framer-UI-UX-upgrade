import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

type UsageLogRow = {
  id: string;
  assetName: string;
  periodStart: string;
  periodEnd: string;
  user: string;
  duration: string;
  purpose: string;
};

type DisposalRequestRow = {
  id: string;
  assetName: string;
  justification: string;
  disposalMethod: string;
  submittedDate: string;
  status: string;
};

type UsageFormState = {
  assetId: string;
  periodStart: string;
  periodEnd: string;
  user: string;
  duration: string;
  purpose: string;
};

type DisposalFormState = {
  assetId: string;
  justification: string;
  disposalMethod: string;
};

type AssetForm = {
  type: string;
  name: string;
  serialNumber: string;
  acquisitionDate: string;
  acquisitionMethod: string;
  value: string;
  location: string;
  custodian: string;
  assetStatus: string;
  description: string;
};

type AssetRow = {
  id: string;
  name: string;
  type: string;
  serialNumber: string;
  acquisitionDate: string;
  acquisitionMethod: string;
  value: string;
  location: string;
  custodian: string;
  condition: string;
  pearlFunded: boolean;
  assetStatus: 'Active' | 'Inactive';
  status: string;
};

const DRAWER_ANIM_MS = 200;

const EMPTY_USAGE_FORM: UsageFormState = {
  assetId: '',
  periodStart: '',
  periodEnd: '',
  user: '',
  duration: '',
  purpose: ''
};

const EMPTY_DISPOSAL_FORM: DisposalFormState = {
  assetId: '',
  justification: '',
  disposalMethod: ''
};

const EMPTY_FORM: AssetForm = {
  type: '',
  name: '',
  serialNumber: '',
  acquisitionDate: '',
  acquisitionMethod: '',
  value: '',
  location: '',
  custodian: '',
  assetStatus: '',
  description: ''
};

const INITIAL_USAGE_LOGS: UsageLogRow[] = [
  {
    id: 'UL-001',
    assetName: 'Rice Mill Machine',
    periodStart: '2024-03-20',
    periodEnd: '2024-03-25',
    user: 'Sok Pisey',
    duration: '4 hours',
    purpose: 'Processing harvest from North Field'
  },
  {
    id: 'UL-002',
    assetName: 'Delivery Truck',
    periodStart: '2024-03-08',
    periodEnd: '2024-03-10',
    user: 'Lim Dara',
    duration: '8 hours',
    purpose: 'Transport to market'
  },
  {
    id: 'UL-003',
    assetName: 'Water Pump System',
    periodStart: '2024-03-15',
    periodEnd: '2024-03-16',
    user: 'Chea Sokha',
    duration: '6 hours',
    purpose: 'Irrigation support during dry spell at North Field'
  }
];

const INITIAL_DISPOSAL_REQUESTS: DisposalRequestRow[] = [
  {
    id: 'DR-001',
    assetName: 'Old Harvester',
    justification: 'Equipment is beyond repair and no longer functional',
    disposalMethod: 'Scrap',
    submittedDate: '2024-03-20',
    status: 'Pending'
  },
  {
    id: 'DR-002',
    assetName: 'Weighing Scale (500kg)',
    justification: 'Calibration failed repeatedly; replacement parts unavailable',
    disposalMethod: 'Write Off',
    submittedDate: '2024-03-18',
    status: 'Pending'
  },
  {
    id: 'DR-003',
    assetName: 'Irrigation Pipeline (500m)',
    justification: 'Section damaged by flooding; uneconomical to restore full length',
    disposalMethod: 'Scrap',
    submittedDate: '2024-03-14',
    status: 'Approved'
  }
];

@Component({
  selector: 'app-asset-management-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './asset-management-page.component.html',
  styleUrl: './asset-management-page.component.scss',
})
export class AssetManagementPageComponent {
  readonly tabs = [
    { id: 'inventory', label: 'Asset Inventory' },
    { id: 'usage-log', label: 'Usage Log' },
    { id: 'disposal', label: 'Disposal Request' }
  ] as const;

  readonly activeTab = signal<(typeof this.tabs)[number]['id']>('inventory');
  readonly exportMenuOpen = signal(false);

  readonly showAddModal = signal(false);
  readonly addModalVisible = signal(false);
  readonly editingAsset = signal<string | null>(null);
  assetForm: AssetForm = { ...EMPTY_FORM };

  readonly showConditionModal = signal(false);
  conditionFormAssetId = '';
  conditionFormRating = '';

  readonly usageDrawerOpen = signal(false);
  readonly usageDrawerVisible = signal(false);
  usageForm: UsageFormState = { ...EMPTY_USAGE_FORM };
  readonly usageHistorySearch = signal('');

  readonly disposalDrawerOpen = signal(false);
  readonly disposalDrawerVisible = signal(false);
  disposalForm: DisposalFormState = { ...EMPTY_DISPOSAL_FORM };
  readonly disposalSearch = signal('');

  readonly assets = signal<AssetRow[]>([
    {
      id: 'AST-001',
      name: 'Rice Mill Machine',
      type: 'Equipment',
      serialNumber: 'RMM-2024-001',
      acquisitionDate: '2024-01-15',
      acquisitionMethod: 'Donated by PEARL',
      value: '$12,000',
      location: 'Main Storage Facility',
      custodian: 'Sok Pisey',
      condition: 'Good',
      pearlFunded: true,
      assetStatus: 'Active',
      status: 'Verified'
    },
    {
      id: 'AST-002',
      name: 'Delivery Truck',
      type: 'Vehicle',
      serialNumber: 'DT-2023-045',
      acquisitionDate: '2023-08-20',
      acquisitionMethod: 'Own Funds',
      value: '$28,000',
      location: 'Vehicle Depot',
      custodian: 'Lim Dara',
      condition: 'Fair',
      pearlFunded: false,
      assetStatus: 'Active',
      status: 'Verified'
    },
    {
      id: 'AST-003',
      name: 'Water Pump System',
      type: 'Equipment',
      serialNumber: 'WPS-2024-012',
      acquisitionDate: '2024-03-10',
      acquisitionMethod: 'Donated by PEARL',
      value: '$3,500',
      location: 'North Field',
      custodian: 'Chea Sokha',
      condition: 'Good',
      pearlFunded: true,
      assetStatus: 'Inactive',
      status: 'Pending Verification'
    }
  ]);

  readonly usageLogs = signal<UsageLogRow[]>(INITIAL_USAGE_LOGS);
  readonly disposalRequests = signal<DisposalRequestRow[]>(INITIAL_DISPOSAL_REQUESTS);

  readonly filteredUsageLogs = computed(() => {
    const q = this.usageHistorySearch().trim().toLowerCase();
    if (!q) return this.usageLogs();
    return this.usageLogs().filter((log) => {
      const periodStr = `${log.periodStart} ${log.periodEnd}`;
      return (
        log.assetName.toLowerCase().includes(q) ||
        log.user.toLowerCase().includes(q) ||
        log.purpose.toLowerCase().includes(q) ||
        log.duration.toLowerCase().includes(q) ||
        periodStr.includes(q) ||
        log.id.toLowerCase().includes(q)
      );
    });
  });

  readonly filteredDisposalRequests = computed(() => {
    const q = this.disposalSearch().trim().toLowerCase();
    if (!q) return this.disposalRequests();
    return this.disposalRequests().filter(
      (row) =>
        row.id.toLowerCase().includes(q) ||
        row.assetName.toLowerCase().includes(q) ||
        row.disposalMethod.toLowerCase().includes(q) ||
        row.status.toLowerCase().includes(q) ||
        row.submittedDate.includes(q) ||
        row.justification.toLowerCase().includes(q)
    );
  });

  formatUsagePeriodRange(isoStart: string, isoEnd: string): string {
    const startRaw = isoStart.trim();
    const endRaw = (isoEnd.trim() || startRaw).trim();
    const iso = /^\d{4}-\d{2}-\d{2}$/;
    const parse = (s: string) => {
      if (!iso.test(s)) return null;
      const d = new Date(`${s}T12:00:00`);
      return Number.isNaN(d.getTime()) ? null : d;
    };
    const s = parse(startRaw);
    const e = parse(endRaw);
    if (!s || !e) return `${startRaw} — ${endRaw}`;
    const sameDay = s.getTime() === e.getTime();
    const sameMonth = s.getMonth() === e.getMonth() && s.getFullYear() === e.getFullYear();
    const sameYear = s.getFullYear() === e.getFullYear();
    const mdn: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    const mdy: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    if (sameDay) return s.toLocaleDateString('en-US', mdy);
    if (sameMonth && sameYear) return `${s.toLocaleDateString('en-US', mdn)} – ${e.getDate()}, ${e.getFullYear()}`;
    if (sameYear) return `${s.toLocaleDateString('en-US', mdn)} – ${e.toLocaleDateString('en-US', mdy)}`;
    return `${s.toLocaleDateString('en-US', mdy)} – ${e.toLocaleDateString('en-US', mdy)}`;
  }

  openAddModal(): void {
    this.editingAsset.set(null);
    this.assetForm = { ...EMPTY_FORM };
    this.showAddModal.set(true);
    setTimeout(() => this.addModalVisible.set(true), 0);
  }

  closeAddModal(): void {
    this.addModalVisible.set(false);
    setTimeout(() => {
      this.showAddModal.set(false);
      this.editingAsset.set(null);
      this.assetForm = { ...EMPTY_FORM };
    }, DRAWER_ANIM_MS);
  }

  openEditModal(asset: AssetRow): void {
    this.editingAsset.set(asset.id);
    this.assetForm = {
      type: asset.type.toLowerCase().replace(/ /g, '-'),
      name: asset.name,
      serialNumber: asset.serialNumber,
      acquisitionDate: asset.acquisitionDate,
      acquisitionMethod: asset.acquisitionMethod.toLowerCase(),
      value: asset.value,
      location: asset.location,
      custodian: asset.custodian,
      assetStatus: asset.assetStatus.toLowerCase(),
      description: ''
    };
    this.showAddModal.set(true);
    setTimeout(() => this.addModalVisible.set(true), 0);
  }

  openConditionModal(asset: AssetRow): void {
    this.conditionFormAssetId = asset.id;
    this.conditionFormRating = asset.condition.toLowerCase();
    this.showConditionModal.set(true);
  }

  closeConditionModal(): void {
    this.showConditionModal.set(false);
    this.conditionFormAssetId = '';
    this.conditionFormRating = '';
  }

  openUsageDrawer(): void {
    this.usageForm = { ...EMPTY_USAGE_FORM };
    this.usageDrawerOpen.set(true);
    setTimeout(() => this.usageDrawerVisible.set(true), 0);
  }

  closeUsageDrawer(): void {
    this.usageDrawerVisible.set(false);
    setTimeout(() => {
      this.usageDrawerOpen.set(false);
      this.usageForm = { ...EMPTY_USAGE_FORM };
    }, DRAWER_ANIM_MS);
  }

  submitUsageRecord(): void {
    const asset = this.assets().find((a) => a.id === this.usageForm.assetId);
    if (!asset || !this.usageForm.periodStart.trim() || !this.usageForm.user.trim() || !this.usageForm.duration.trim() || !this.usageForm.purpose.trim()) return;
    this.usageLogs.update((prev) => {
      const maxNum = prev.reduce((acc, row) => {
        const m = /^UL-(\d+)$/i.exec(row.id);
        const n = m ? parseInt(m[1], 10) : 0;
        return Math.max(acc, n);
      }, 0);
      const nextId = `UL-${String(maxNum + 1).padStart(3, '0')}`;
      return [
        ...prev,
        {
          id: nextId,
          assetName: asset.name,
          periodStart: this.usageForm.periodStart,
          periodEnd: this.usageForm.periodEnd.trim() || this.usageForm.periodStart,
          user: this.usageForm.user.trim(),
          duration: this.usageForm.duration.trim(),
          purpose: this.usageForm.purpose.trim()
        }
      ];
    });
    this.closeUsageDrawer();
  }

  deleteUsage(id: string): void {
    this.usageLogs.update((prev) => prev.filter((r) => r.id !== id));
  }

  openDisposalDrawer(): void {
    this.disposalForm = { ...EMPTY_DISPOSAL_FORM };
    this.disposalDrawerOpen.set(true);
    setTimeout(() => this.disposalDrawerVisible.set(true), 0);
  }

  closeDisposalDrawer(): void {
    this.disposalDrawerVisible.set(false);
    setTimeout(() => {
      this.disposalDrawerOpen.set(false);
      this.disposalForm = { ...EMPTY_DISPOSAL_FORM };
    }, DRAWER_ANIM_MS);
  }

  submitDisposalRequest(): void {
    const asset = this.assets().find((a) => a.id === this.disposalForm.assetId);
    const methodLabelMap: Record<string, string> = {
      sell: 'Sell',
      scrap: 'Scrap',
      transfer: 'Transfer',
      'write-off': 'Write Off'
    };
    const methodLabel = methodLabelMap[this.disposalForm.disposalMethod] ?? '';
    if (!asset || !this.disposalForm.justification.trim() || !methodLabel) return;
    const submittedDate = new Date().toISOString().slice(0, 10);
    this.disposalRequests.update((prev) => {
      const maxNum = prev.reduce((acc, row) => {
        const m = /^DR-(\d+)$/i.exec(row.id);
        const n = m ? parseInt(m[1], 10) : 0;
        return Math.max(acc, n);
      }, 0);
      const nextId = `DR-${String(maxNum + 1).padStart(3, '0')}`;
      return [
        ...prev,
        {
          id: nextId,
          assetName: asset.name,
          justification: this.disposalForm.justification.trim(),
          disposalMethod: methodLabel,
          submittedDate,
          status: 'Pending'
        }
      ];
    });
    this.closeDisposalDrawer();
  }
}
