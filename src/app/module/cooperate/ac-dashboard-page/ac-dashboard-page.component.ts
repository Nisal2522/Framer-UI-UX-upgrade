import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '@/app/core/service/notification.service';
import { CooperativeWorkflowsService } from '@/app/core/service/cooperative-workflows.service';
import { CooperativeLocationMapComponent } from '@/app/module/cooperate/cooperative-location-map/cooperative-location-map.component';
import { DashboardMetricCard, DashboardMetricCardsComponent } from './components/dashboard-metric-cards.component';

type TrainingMemberDirectory = { id: string; name: string };

const GENDER_DATA = [
  { name: 'Male', value: 258, percent: 58, color: '#0F2F8F' },
  { name: 'Female', value: 186, percent: 42, color: '#E00025' },
  { name: 'Other', value: 3, percent: 1, color: '#64748B' }
];

const AGE_GROUP_DATA = [
  { group: '18-25', Male: 25, Female: 18, Other: 2 },
  { group: '26-35', Male: 71, Female: 50, Other: 2 },
  { group: '36-45', Male: 91, Female: 63, Other: 2 },
  { group: '46-55', Male: 52, Female: 36, Other: 1 },
  { group: '55+', Male: 20, Female: 21, Other: 0 }
];

const CROP_DISTRIBUTION_DATA = [
  { crop: 'Rice', expectedYield: 234 },
  { crop: 'Cassava', expectedYield: 156 },
  { crop: 'Corn', expectedYield: 98 },
  { crop: 'Vegetables', expectedYield: 76 }
];

const LIVESTOCK_DATA = [
  { type: 'Cattle', expectedYield: 128 },
  { type: 'Poultry', expectedYield: 312 },
  { type: 'Pigs', expectedYield: 89 },
  { type: 'Goats', expectedYield: 45 }
];

const FARMER_AREA_DATA = [
  { area: 'Battambang', members: 78 },
  { area: 'Siem Reap', members: 62 },
  { area: 'Kampong Thom', members: 55 },
  { area: 'Kampong Cham', members: 49 },
  { area: 'Takeo', members: 41 },
  { area: 'Kampot', members: 37 },
  { area: 'Prey Veng', members: 33 },
  { area: 'Banteay Meanchey', members: 29 },
  { area: 'Pursat', members: 26 },
  { area: 'Kandal', members: 24 },
  { area: 'Kep', members: 13 }
];

@Component({
  selector: 'app-ac-dashboard-page',
  standalone: true,
  imports: [CommonModule, FormsModule, CooperativeLocationMapComponent, DashboardMetricCardsComponent],
  templateUrl: './ac-dashboard-page.component.html',
  styleUrl: './ac-dashboard-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AcDashboardPageComponent {
  private readonly workflows = inject(CooperativeWorkflowsService);
  private readonly notificationService = inject(NotificationService);

  readonly trainings = toSignal(this.workflows.trainingRows$, { initialValue: [] });
  readonly trainingMembers = toSignal(this.workflows.trainingMembers$, { initialValue: [] });
  readonly assets = toSignal(this.workflows.assets$, { initialValue: [] });

  readonly assetCount = computed(() => this.assets().length);
  readonly registrationTrainingId = signal<string | null>(null);
  readonly memberSearch = signal('');

  readonly memberDirectory: TrainingMemberDirectory[] = [
    { id: 'FM-001', name: 'Sok Pisey' },
    { id: 'FM-002', name: 'Chea Sokha' },
    { id: 'FM-003', name: 'Lim Dara' },
    { id: 'FM-004', name: 'Pich Sophea' },
    { id: 'FM-005', name: 'Keo Sothea' },
    { id: 'FM-006', name: 'Mao Vibol' },
    { id: 'FM-007', name: 'Yon Chanthy' },
    { id: 'FM-008', name: 'Heng Ratha' },
    { id: 'FM-009', name: 'Nget Bopha' },
    { id: 'FM-010', name: 'Ros Channak' }
  ];

  readonly genderData = GENDER_DATA;
  readonly ageGroupData = AGE_GROUP_DATA;
  readonly cropDistributionData = CROP_DISTRIBUTION_DATA;
  readonly livestockData = LIVESTOCK_DATA;
  readonly farmerAreaData = FARMER_AREA_DATA;
  readonly palette = ['#0F2F8F', '#0D2A7D', '#3B5FCC', '#6B8EFF'];

  readonly milestones = [
    { name: 'Equipment Purchase', due: 'Apr 30' },
    { name: 'Training Session', due: 'May 15' },
    { name: 'Crop Expansion', due: 'Jun 20' }
  ];

  readonly knowledgeMetrics = [
    {
      label: 'Materials Received',
      value: '47',
      note: '+5 this month',
      icon: 'bi-book',
      iconClass: 'text-blue-600',
      cardClass: 'bg-blue-50 border-blue-200'
    },
    {
      label: 'Activity Completion',
      value: '89%',
      note: 'Above target (75%)',
      icon: 'bi-check-circle',
      iconClass: 'text-purple-600',
      cardClass: 'bg-purple-50 border-purple-200'
    },
    {
      label: 'Training Participation',
      value: '342',
      note: 'Members participated',
      icon: 'bi-people',
      iconClass: 'text-emerald-600',
      cardClass: 'bg-emerald-50 border-emerald-200'
    }
  ];

  readonly selectedTraining = computed(() => {
    const id = this.registrationTrainingId();
    if (!id) return null;
    return this.trainings().find((t) => t.id === id) ?? null;
  });

  readonly selectedTrainingMembers = computed(() => {
    const trainingId = this.registrationTrainingId();
    if (!trainingId) return [];
    return this.trainingMembers().filter((member) => member.trainingId === trainingId);
  });

  readonly selectedMemberIds = computed(() => new Set(this.selectedTrainingMembers().map((member) => member.memberId)));

  readonly filteredMembers = computed(() => {
    const query = this.memberSearch().trim().toLowerCase();
    return this.memberDirectory.filter((member) => {
      if (this.selectedMemberIds().has(member.id)) return false;
      if (!query) return true;
      return member.name.toLowerCase().includes(query);
    });
  });

  readonly availableSeats = computed(() => {
    const selected = this.selectedTraining();
    if (!selected) return 0;
    return Math.max(selected.capacity - selected.joinedCount, 0);
  });

  readonly membershipCards = computed<DashboardMetricCard[]>(() => [
    { label: 'Active members', icon: 'bi-people-fill', value: '447' },
    { label: 'Male Members', icon: 'bi-person-check-fill', value: '258', subtext: '57.7%' },
    { label: 'Female Members', icon: 'bi-heart-fill', value: '186', subtext: '41.6%' },
    { label: 'New this year', icon: 'bi-graph-up-arrow', value: '49', badge: '+12.3%' },
    { label: 'Dropout rate', icon: 'bi-person-x-fill', value: '3.2%' },
    { label: 'Business plans approved', icon: 'bi-check-circle-fill', value: '1' }
  ]);

  readonly topCoverageAreas = computed(() =>
    [...this.farmerAreaData].sort((a, b) => b.members - a.members).slice(0, 6)
  );
  readonly totalMembers = computed(() => this.genderData.reduce((sum, item) => sum + item.value, 0));
  readonly ageMaxValue = computed(() => Math.max(...this.ageGroupData.map((item) => Math.max(item.Male, item.Female, item.Other))));
  readonly totalMappedMembers = computed(() => this.farmerAreaData.reduce((sum, item) => sum + item.members, 0));
  readonly maxAreaMembers = computed(() => Math.max(...this.farmerAreaData.map((item) => item.members)));
  readonly maxCropYield = computed(() => Math.max(...this.cropDistributionData.map((item) => item.expectedYield)));
  readonly maxLivestockYield = computed(() => Math.max(...this.livestockData.map((item) => item.expectedYield)));
  readonly ageAxisTicks = [100, 75, 50, 25, 0];
  readonly genderDonutBackground = computed(() => {
    const male = this.genderData[0].percent;
    const female = this.genderData[1].percent;
    const other = this.genderData[2].percent;
    return `conic-gradient(#0F2F8F 0 ${male}%, #E00025 ${male}% ${male + female}%, #94A3B8 ${male + female}% ${
      male + female + other
    }%, #EEF2FF ${male + female + other}% 100%)`;
  });
  readonly assetSummaryCards = computed(() => [
    { label: 'Total Assets', value: String(this.assetCount()), cardClass: 'border-gray-200', valueClass: 'text-gray-900' },
    { label: 'Good Condition', value: '18', cardClass: 'bg-emerald-50 border-emerald-200', valueClass: 'text-emerald-600' },
    { label: 'Fair Condition', value: '7', cardClass: 'bg-blue-50 border-blue-200', valueClass: 'text-blue-600' },
    { label: 'Needs Attention', value: '3', cardClass: 'bg-orange-50 border-orange-200', valueClass: 'text-orange-600' }
  ]);

  openRegisterModal(trainingId: string): void {
    this.registrationTrainingId.set(trainingId);
    this.memberSearch.set('');
  }

  closeRegistration(): void {
    this.registrationTrainingId.set(null);
  }

  addMemberToTraining(memberId: string): void {
    const trainingId = this.registrationTrainingId();
    if (!trainingId) return;
    if (this.availableSeats() <= 0) {
      this.notify('Training is full', 'No available seats left in this training.');
      return;
    }
    const member = this.memberDirectory.find((m) => m.id === memberId);
    if (!member) return;
    const success = this.workflows.addTrainingMember(trainingId, { memberId, name: member.name });
    if (!success) {
      this.notify('Member not added', 'This member may already be registered.');
      return;
    }
    this.notify('Member added', `${member.name} added to training.`);
  }

  addAllMembersToTraining(): void {
    const trainingId = this.registrationTrainingId();
    if (!trainingId) return;
    let added = 0;
    for (const member of this.filteredMembers()) {
      if (added >= this.availableSeats()) break;
      const success = this.workflows.addTrainingMember(trainingId, { memberId: member.id, name: member.name });
      if (success) added += 1;
    }
    if (added === 0) {
      this.notify('No members added', 'No eligible members found or training is full.');
      return;
    }
    this.notify('Members added', `${added} members added to training.`);
  }

  removeMemberFromTraining(joinedMemberId: string): void {
    this.workflows.removeTrainingMember(joinedMemberId);
    this.notify('Member removed', 'Member removed from this training.');
  }

  private notify(title: string, body: string): void {
    this.notificationService.addNotification({ title, body, audience: 'Cooperative' });
  }

  getAgeBarHeight(value: number): number {
    const max = this.ageMaxValue();
    if (!max) return 0;
    return Math.max((value / max) * 100, value > 0 ? 2.5 : 0);
  }

  visibleGenderPercent(percent: number): number {
    if (percent <= 0) return 0;
    return Math.max(percent, 2.5);
  }

  isTrainingFull(joinedCount: number, capacity: number): boolean {
    return joinedCount >= capacity;
  }

  trainingBadgeLabel(joinedCount: number, capacity: number): string {
    return this.isTrainingFull(joinedCount, capacity) ? 'Full' : 'Open';
  }
}
