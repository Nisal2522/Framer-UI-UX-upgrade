import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { farmerMemberPortraitUrl } from '@/app/core/helpers/committee-portraits';

const PAGE_SIZE = 100;
const TOTAL_MEMBERS = 447;
const MALE_COUNT = 258;
const FEMALE_COUNT = 186;
const OTHER_COUNT = TOTAL_MEMBERS - MALE_COUNT - FEMALE_COUNT;

type MemberRow = {
  id: string;
  fullName: string;
  nationalId: string;
  gender: string;
  dateOfBirth: string;
  age: number;
  village: string;
  phone: string;
  landArea: number;
  crops: string[];
  livestock: { type: string; count: number }[];
  membershipStartDate: string;
  status: string;
};

const SEED_MEMBERS: MemberRow[] = [
  {
    id: 'FM-001',
    fullName: 'Sok Pisey',
    nationalId: '010234567',
    gender: 'Male',
    dateOfBirth: '1979-03-15',
    age: 45,
    village: 'Baray Village',
    phone: '+855 12 345 678',
    landArea: 5.2,
    crops: ['Rice', 'Cassava'],
    livestock: [
      { type: 'Cattle', count: 3 },
      { type: 'Chickens', count: 20 }
    ],
    membershipStartDate: '2015-06-15',
    status: 'Active'
  },
  {
    id: 'FM-002',
    fullName: 'Chea Sokha',
    nationalId: '010345678',
    gender: 'Female',
    dateOfBirth: '1986-07-22',
    age: 38,
    village: 'Baray Village',
    phone: '+855 23 456 789',
    landArea: 3.8,
    crops: ['Cassava', 'Vegetables'],
    livestock: [{ type: 'Pigs', count: 5 }],
    membershipStartDate: '2016-03-10',
    status: 'Active'
  },
  {
    id: 'FM-003',
    fullName: 'Lim Dara',
    nationalId: '010456789',
    gender: 'Male',
    dateOfBirth: '1972-11-08',
    age: 52,
    village: 'North Village',
    phone: '+855 34 567 890',
    landArea: 7.5,
    crops: ['Rice', 'Corn'],
    livestock: [
      { type: 'Cattle', count: 5 },
      { type: 'Buffalo', count: 2 }
    ],
    membershipStartDate: '2015-06-15',
    status: 'Active'
  }
];

@Component({
  selector: 'app-members-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './members-page.component.html',
  styleUrl: './members-page.component.scss',
})
export class MembersPageComponent {
  private readonly router = inject(Router);

  readonly totalMembers = TOTAL_MEMBERS;
  readonly maleCount = MALE_COUNT;
  readonly femaleCount = FEMALE_COUNT;
  readonly otherCount = OTHER_COUNT;
  readonly avgLandArea = 4.8;

  readonly searchTerm = signal('');
  readonly currentPage = signal(1);

  readonly allMembers: MemberRow[] = (() => {
    const list: MemberRow[] = [];
    for (let i = 0; i < TOTAL_MEMBERS; i++) {
      const seed = SEED_MEMBERS[i % 3];
      let gender: string;
      if (i < MALE_COUNT) gender = 'Male';
      else if (i < MALE_COUNT + FEMALE_COUNT) gender = 'Female';
      else gender = 'Other';
      list.push({
        ...seed,
        id: `FM-${String(i + 1).padStart(3, '0')}`,
        fullName: i < 3 ? seed.fullName : `Member ${i + 1}`,
        nationalId: `${String(100000000 + i).slice(0, 9)}`,
        gender,
        age: 18 + (i % 50)
      });
    }
    return list;
  })();

  readonly filteredMembers = computed(() => {
    const q = this.searchTerm().trim().toLowerCase();
    if (!q) return this.allMembers;
    return this.allMembers.filter(
      (m) =>
        m.fullName.toLowerCase().includes(q) ||
        m.nationalId.includes(q) ||
        m.gender.toLowerCase().includes(q) ||
        m.crops.some((c) => c.toLowerCase().includes(q))
    );
  });

  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filteredMembers().length / PAGE_SIZE)));
  readonly page = computed(() => Math.min(this.currentPage(), this.totalPages()));
  readonly pageSlice = computed(() => {
    const start = (this.page() - 1) * PAGE_SIZE;
    return this.filteredMembers().slice(start, start + PAGE_SIZE);
  });

  readonly startIndex = computed(() => (this.filteredMembers().length === 0 ? 0 : (this.page() - 1) * PAGE_SIZE + 1));
  readonly endIndex = computed(() => Math.min(this.page() * PAGE_SIZE, this.filteredMembers().length));

  onSearchChange(value: string): void {
    this.searchTerm.set(value);
    this.currentPage.set(1);
  }

  previousPage(): void {
    this.currentPage.update((p) => Math.max(1, p - 1));
  }

  nextPage(): void {
    this.currentPage.update((p) => Math.min(this.totalPages(), p + 1));
  }

  addMember(): void {
    this.router.navigateByUrl('/dashboard/farmer-members/new');
  }

  editMember(member: MemberRow): void {
    this.router.navigate(['/dashboard/farmer-members/edit', member.id], { state: { member } });
  }

  genderPercent(value: number): string {
    return ((value / this.totalMembers) * 100).toFixed(1);
  }

  portrait(member: MemberRow): string {
    return farmerMemberPortraitUrl(member);
  }
}
