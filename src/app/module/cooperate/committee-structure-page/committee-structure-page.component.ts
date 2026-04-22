import { CommonModule } from '@angular/common';
import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { committeeMemberPortraitUrl } from '@/app/core/helpers/committee-portraits';

type CommitteeMember = {
  id: string;
  fullName: string;
  nationalId: string;
  gender: string;
  dateOfBirth: string;
  phoneNumber: string;
  roleTitle: string;
  appointmentDate: string;
  termEndDate: string;
  email?: string;
};

type CommitteeAssignmentRow = {
  role: string;
  memberId: string;
};

type CommitteePeriod = {
  id: string;
  label: string;
  from: string;
  to: string;
  assignments: CommitteeAssignmentRow[];
};

@Component({
  selector: 'app-committee-structure-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './committee-structure-page.component.html',
  styleUrl: './committee-structure-page.component.scss',
})
export class CommitteeStructurePageComponent {
  readonly committeePeriods: CommitteePeriod[] = [
    {
      id: 'current',
      label: 'Jan 15, 2024 - Dec 31, 2026',
      from: '2024-01-15',
      to: '2026-12-31',
      assignments: [
        { role: 'chairman', memberId: '1' },
        { role: 'vice-chairman', memberId: '2' },
        { role: 'treasurer', memberId: '3' },
        { role: 'secretary', memberId: '4' },
        { role: 'member', memberId: '5' },
        { role: 'member', memberId: '6' }
      ]
    },
    {
      id: '2021-2023',
      label: 'Jan 10, 2021 - Dec 31, 2023',
      from: '2021-01-10',
      to: '2023-12-31',
      assignments: [
        { role: 'chairman', memberId: '3' },
        { role: 'vice-chairman', memberId: '1' },
        { role: 'treasurer', memberId: '4' },
        { role: 'secretary', memberId: '2' },
        { role: 'auditor', memberId: '5' }
      ]
    },
    {
      id: '2018-2020',
      label: 'Jan 05, 2018 - Dec 31, 2020',
      from: '2018-01-05',
      to: '2020-12-31',
      assignments: [
        { role: 'chairman', memberId: '5' },
        { role: 'vice-chairman', memberId: '3' },
        { role: 'treasurer', memberId: '6' },
        { role: 'secretary', memberId: '1' }
      ]
    }
  ];

  readonly currentCommittee: CommitteeMember[] = [
    {
      id: '1',
      fullName: 'Sok Pisey',
      nationalId: '010234567',
      gender: 'Male',
      dateOfBirth: '1979-03-15',
      phoneNumber: '+855 12 345 678',
      roleTitle: 'Chairman',
      appointmentDate: '2024-01-15',
      termEndDate: '2026-12-31',
      email: 'sok.pisey@example.com'
    },
    {
      id: '2',
      fullName: 'Chea Sokha',
      nationalId: '010345678',
      gender: 'Female',
      dateOfBirth: '1986-07-22',
      phoneNumber: '+855 23 456 789',
      roleTitle: 'Vice Chairman',
      appointmentDate: '2024-01-15',
      termEndDate: '2026-12-31'
    },
    {
      id: '3',
      fullName: 'Lim Dara',
      nationalId: '010456789',
      gender: 'Male',
      dateOfBirth: '1972-11-08',
      phoneNumber: '+855 34 567 890',
      roleTitle: 'Treasurer',
      appointmentDate: '2024-01-15',
      termEndDate: '2026-12-31'
    },
    {
      id: '4',
      fullName: 'Pich Sophea',
      nationalId: '010567890',
      gender: 'Female',
      dateOfBirth: '1990-05-30',
      phoneNumber: '+855 45 678 901',
      roleTitle: 'Secretary',
      appointmentDate: '2024-01-15',
      termEndDate: '2026-12-31'
    },
    {
      id: '5',
      fullName: 'Keo Sothea',
      nationalId: '010678901',
      gender: 'Male',
      dateOfBirth: '1985-09-12',
      phoneNumber: '+855 56 789 012',
      roleTitle: 'Member Relations Officer',
      appointmentDate: '2024-01-15',
      termEndDate: '2026-12-31'
    },
    {
      id: '6',
      fullName: 'Mao Vibol',
      nationalId: '010789012',
      gender: 'Male',
      dateOfBirth: '1988-02-18',
      phoneNumber: '+855 67 890 123',
      roleTitle: 'Training Coordinator',
      appointmentDate: '2024-01-15',
      termEndDate: '2026-12-31'
    }
  ];

  readonly showAddModal = signal(false);
  readonly addModalVisible = signal(false);
  readonly editingPeriodId = signal<string | null>(null);
  readonly selectedPeriod = signal('current');
  readonly committeeAssignments = signal<CommitteeAssignmentRow[]>([{ role: '', memberId: '' }]);
  readonly periodFrom = signal('');
  readonly periodTo = signal('');

  private static readonly DRAWER_ANIM_MS = 200;

  readonly selectedEditingPeriodLabel = computed(() => {
    const id = this.editingPeriodId();
    if (!id) return '';
    return this.committeePeriods.find((p) => p.id === id)?.label ?? '';
  });

  readonly chairman = this.currentCommittee[0];
  readonly viceChairman = this.currentCommittee[1];
  readonly treasurer = this.currentCommittee[2];
  readonly secretary = this.currentCommittee[3];
  readonly memberRelationsOfficer = this.currentCommittee[4];
  readonly trainingCoordinator = this.currentCommittee[5];

  portrait(member: CommitteeMember): string {
    return committeeMemberPortraitUrl(member);
  }

  openAddModal(): void {
    this.editingPeriodId.set(null);
    this.periodFrom.set('');
    this.periodTo.set('');
    this.committeeAssignments.set([{ role: '', memberId: '' }]);
    this.showAddModal.set(true);
    setTimeout(() => this.addModalVisible.set(true), 0);
  }

  openEditModal(periodId: string): void {
    const period = this.committeePeriods.find((p) => p.id === periodId);
    if (!period) return;
    this.editingPeriodId.set(periodId);
    this.periodFrom.set(period.from);
    this.periodTo.set(period.to);
    this.committeeAssignments.set(period.assignments.map((a) => ({ ...a })));
    this.showAddModal.set(true);
    setTimeout(() => this.addModalVisible.set(true), 0);
  }

  closeAddModal(): void {
    this.addModalVisible.set(false);
    setTimeout(() => {
      this.showAddModal.set(false);
      this.editingPeriodId.set(null);
    }, CommitteeStructurePageComponent.DRAWER_ANIM_MS);
  }

  addAssignmentRow(): void {
    this.committeeAssignments.update((rows) => [...rows, { role: '', memberId: '' }]);
  }

  removeAssignmentRow(index: number): void {
    this.committeeAssignments.update((rows) => {
      if (rows.length === 1) return rows;
      return rows.filter((_, i) => i !== index);
    });
  }

  updateAssignmentRow(index: number, key: keyof CommitteeAssignmentRow, value: string): void {
    this.committeeAssignments.update((rows) => rows.map((row, i) => (i === index ? { ...row, [key]: value } : row)));
  }
}
