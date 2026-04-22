import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type AssetRecord = {
  id: string;
  name: string;
  type: string;
  acquisitionMethod: string;
  value: string;
  condition: 'Good' | 'Fair' | 'Poor';
  assetStatus: 'Active' | 'Inactive';
  verificationStatus: 'Verified' | 'Pending';
};

export type UsageLogRecord = {
  id: string;
  assetId: string;
  assetName: string;
  periodStart: string;
  periodEnd: string;
  user: string;
  duration: string;
  purpose: string;
};

export type DisposalRequestRecord = {
  id: string;
  assetId: string;
  assetName: string;
  justification: string;
  disposalMethod: string;
  submittedDate: string;
  status: 'Pending' | 'Approved';
};

export type TrainingSessionRecord = {
  id: string;
  title: string;
  month: string;
  day: number;
  year: number;
  time: string;
  location: string;
  presenter: 'GDA' | 'FAO' | 'MAFF' | 'DACP';
  joinedCount: number;
  capacity: number;
};

export type JoinedTrainingMember = {
  id: string;
  memberId: string;
  trainingId: string;
  name: string;
  registeredAt: string;
};

export type BusinessPlanSummary = {
  id: string;
  title: string;
  status: 'Draft' | 'Under Review' | 'Approved' | 'Rejected';
  submittedDate: string | null;
  approvedDate: string | null;
  budget: string;
  progress: number;
  reviewer: string;
};

@Injectable({ providedIn: 'root' })
export class CooperativeWorkflowsService {
  private readonly assetsSubject = new BehaviorSubject<AssetRecord[]>([
    {
      id: 'AST-001',
      name: 'Rice Mill Machine',
      type: 'Equipment',
      acquisitionMethod: 'Donated by PEARL',
      value: '$12,000',
      condition: 'Good',
      assetStatus: 'Active',
      verificationStatus: 'Verified'
    },
    {
      id: 'AST-002',
      name: 'Delivery Truck',
      type: 'Vehicle',
      acquisitionMethod: 'Own Funds',
      value: '$28,000',
      condition: 'Fair',
      assetStatus: 'Active',
      verificationStatus: 'Verified'
    },
    {
      id: 'AST-003',
      name: 'Water Pump System',
      type: 'Equipment',
      acquisitionMethod: 'Donated by PEARL',
      value: '$3,500',
      condition: 'Good',
      assetStatus: 'Inactive',
      verificationStatus: 'Pending'
    }
  ]);

  private readonly usageLogsSubject = new BehaviorSubject<UsageLogRecord[]>([
    {
      id: 'UL-001',
      assetId: 'AST-001',
      assetName: 'Rice Mill Machine',
      periodStart: '2024-03-20',
      periodEnd: '2024-03-25',
      user: 'Sok Pisey',
      duration: '4 hours',
      purpose: 'Processing harvest from North Field'
    }
  ]);

  private readonly disposalRequestsSubject = new BehaviorSubject<DisposalRequestRecord[]>([
    {
      id: 'DR-001',
      assetId: 'AST-003',
      assetName: 'Water Pump System',
      justification: 'Surplus unit after upgrade',
      disposalMethod: 'Sell',
      submittedDate: '2024-03-08',
      status: 'Pending'
    }
  ]);

  private readonly trainingRowsSubject = new BehaviorSubject<TrainingSessionRecord[]>([
    {
      id: 'tr-1',
      title: 'GAP refresher — record keeping',
      month: 'Apr',
      day: 9,
      year: 2026,
      time: '08:30 – 12:00',
      location: 'AC meeting hall',
      presenter: 'GDA',
      joinedCount: 28,
      capacity: 40
    },
    {
      id: 'tr-2',
      title: 'Post-harvest handling demo',
      month: 'Apr',
      day: 19,
      year: 2026,
      time: '07:00 – 11:00',
      location: 'Central warehouse apron',
      presenter: 'FAO',
      joinedCount: 45,
      capacity: 45
    },
    {
      id: 'tr-3',
      title: 'Financial literacy — savings circles',
      month: 'Apr',
      day: 16,
      year: 2026,
      time: '14:00 – 16:30',
      location: 'Commune office (Annex)',
      presenter: 'MAFF',
      joinedCount: 18,
      capacity: 35
    },
    {
      id: 'tr-4',
      title: 'Water management for dry spells',
      month: 'Apr',
      day: 23,
      year: 2026,
      time: '09:00 – 11:00',
      location: 'AC training room',
      presenter: 'DACP',
      joinedCount: 16,
      capacity: 30
    }
  ]);

  private readonly trainingMembersSubject = new BehaviorSubject<JoinedTrainingMember[]>([
    {
      id: 'jm-1',
      memberId: 'FM-001',
      trainingId: 'tr-1',
      name: 'Sok Pisey',
      registeredAt: 'Apr 4, 2026'
    }
  ]);

  private readonly businessPlansSubject = new BehaviorSubject<BusinessPlanSummary[]>([
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
      id: 'BP-2024-015',
      title: 'Climate-Resilient Farming Initiative',
      status: 'Approved',
      submittedDate: '2024-02-20',
      approvedDate: '2024-03-05',
      budget: '$62,000',
      progress: 42,
      reviewer: 'Ministry Committee'
    }
  ]);

  readonly assets$ = this.assetsSubject.asObservable();
  readonly usageLogs$ = this.usageLogsSubject.asObservable();
  readonly disposalRequests$ = this.disposalRequestsSubject.asObservable();
  readonly trainingRows$ = this.trainingRowsSubject.asObservable();
  readonly trainingMembers$ = this.trainingMembersSubject.asObservable();
  readonly businessPlans$ = this.businessPlansSubject.asObservable();

  addUsageLog(payload: Omit<UsageLogRecord, 'id' | 'assetName'>): void {
    const assets = this.assetsSubject.value;
    const asset = assets.find((item) => item.id === payload.assetId);
    if (!asset) return;

    const nextNumber = this.nextNumericId(this.usageLogsSubject.value.map((item) => item.id), 'UL-');
    const nextRecord: UsageLogRecord = {
      ...payload,
      id: `UL-${String(nextNumber).padStart(3, '0')}`,
      assetName: asset.name,
      periodEnd: payload.periodEnd || payload.periodStart
    };

    this.usageLogsSubject.next([...this.usageLogsSubject.value, nextRecord]);
  }

  deleteUsageLog(id: string): void {
    this.usageLogsSubject.next(this.usageLogsSubject.value.filter((row) => row.id !== id));
  }

  addDisposalRequest(payload: Omit<DisposalRequestRecord, 'id' | 'assetName' | 'submittedDate' | 'status'>): void {
    const assets = this.assetsSubject.value;
    const asset = assets.find((item) => item.id === payload.assetId);
    if (!asset) return;

    const nextNumber = this.nextNumericId(this.disposalRequestsSubject.value.map((item) => item.id), 'DR-');
    const nextRecord: DisposalRequestRecord = {
      ...payload,
      id: `DR-${String(nextNumber).padStart(3, '0')}`,
      assetName: asset.name,
      submittedDate: new Date().toISOString().slice(0, 10),
      status: 'Pending'
    };

    this.disposalRequestsSubject.next([...this.disposalRequestsSubject.value, nextRecord]);
  }

  addTrainingMember(trainingId: string, member: { memberId: string; name: string }): boolean {
    const trainings = this.trainingRowsSubject.value;
    const training = trainings.find((item) => item.id === trainingId);
    if (!training) return false;
    if (training.joinedCount >= training.capacity) return false;

    const alreadyJoined = this.trainingMembersSubject.value.some(
      (item) => item.trainingId === trainingId && item.memberId === member.memberId
    );
    if (alreadyJoined) return false;

    const nextJoined: JoinedTrainingMember = {
      id: `jm-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      memberId: member.memberId,
      trainingId,
      name: member.name,
      registeredAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      })
    };

    this.trainingMembersSubject.next([nextJoined, ...this.trainingMembersSubject.value]);
    this.trainingRowsSubject.next(
      trainings.map((row) => (row.id === trainingId ? { ...row, joinedCount: row.joinedCount + 1 } : row))
    );
    return true;
  }

  removeTrainingMember(joinedMemberId: string): void {
    const member = this.trainingMembersSubject.value.find((item) => item.id === joinedMemberId);
    if (!member) return;

    this.trainingMembersSubject.next(this.trainingMembersSubject.value.filter((item) => item.id !== joinedMemberId));
    this.trainingRowsSubject.next(
      this.trainingRowsSubject.value.map((row) =>
        row.id === member.trainingId ? { ...row, joinedCount: Math.max(0, row.joinedCount - 1) } : row
      )
    );
  }

  saveBusinessPlanDraft(payload: { title: string; budget: string }): void {
    const nextNumber = this.nextNumericId(this.businessPlansSubject.value.map((item) => item.id), 'BP-2026-');
    const nextRecord: BusinessPlanSummary = {
      id: `BP-2026-${String(nextNumber).padStart(3, '0')}`,
      title: payload.title || 'Untitled business plan',
      status: 'Draft',
      submittedDate: null,
      approvedDate: null,
      budget: payload.budget || '$0',
      progress: 0,
      reviewer: 'Not Assigned'
    };

    this.businessPlansSubject.next([nextRecord, ...this.businessPlansSubject.value]);
  }

  private nextNumericId(ids: string[], prefix: string): number {
    return (
      ids.reduce((max, value) => {
        if (!value.startsWith(prefix)) return max;
        const number = Number.parseInt(value.slice(prefix.length), 10);
        if (Number.isNaN(number)) return max;
        return Math.max(max, number);
      }, 0) + 1
    );
  }
}
