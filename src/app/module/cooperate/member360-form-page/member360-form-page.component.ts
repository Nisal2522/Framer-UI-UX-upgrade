import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener, ViewChild, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { farmerMemberPortraitUrl } from '@/app/core/helpers/committee-portraits';

type MemberTab = 'profile' | 'land' | 'crops' | 'dossier';
type MemberData = {
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

type ProfileFormData = {
  nameWithInitial: string;
  fullName: string;
  fixedPhone: string;
  mobilePhone: string;
  nicPpNo: string;
  address: string;
  region: string;
  city: string;
  fieldOfficer: string;
  gender: string;
  contactPerson: string;
  contactPersonPhone: string;
};

type LandRow = { name: string; extend: string; status: string; certifications: string[] };
type CropRow = { landName: string; cropName: string; yield: string; plants: string };
type DocRow = { docName: string; landName: string; uploadDate: string; fileSize: string; fileName: string };

const EMPTY_LAND: LandRow = { name: '', extend: '', status: '', certifications: [] };
const EMPTY_CROP: CropRow = { landName: '', cropName: '', yield: '', plants: '' };
const EMPTY_DOC: DocRow = { docName: '', landName: '', uploadDate: '', fileSize: '', fileName: '' };
const DRAWER_ANIM_MS = 200;

@Component({
  selector: 'app-member360-form-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './member360-form-page.component.html',
  styleUrl: './member360-form-page.component.scss',
})
export class Member360FormPageComponent {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  @ViewChild('certDropdownRef') certDropdownRef?: ElementRef<HTMLDivElement>;
  readonly tabs: { id: MemberTab; label: string }[] = [
    { id: 'profile', label: 'Profile' },
    { id: 'land', label: 'Land' },
    { id: 'crops', label: 'Crops' },
    { id: 'dossier', label: 'Dossier' }
  ];
  readonly certOptions = ['USDA-NOP', 'EU Organic', 'JAS', 'GLOBAL G.A.P.'];
  readonly cropOptions = ['Rice', 'Cassava', 'Corn', 'Coconut', 'Banana', 'Pepper', 'Vegetables'];

  readonly activeTab = signal<MemberTab>('profile');
  readonly profileImage = signal<string | null>(null);
  readonly isDragging = signal(false);

  readonly memberData = signal<MemberData | null>(null);
  readonly isEditMode = computed(() => !!this.route.snapshot.paramMap.get('memberId') && !!this.memberData());

  readonly landRows = signal<LandRow[]>([]);
  readonly cropRows = signal<CropRow[]>([]);
  readonly docRows = signal<DocRow[]>([]);

  readonly landPanelOpen = signal(false);
  readonly landPanelVisible = signal(false);
  readonly landEditRow = signal<number | null>(null);

  readonly cropPanelOpen = signal(false);
  readonly cropPanelVisible = signal(false);
  readonly cropEditRow = signal<number | null>(null);

  readonly docPanelOpen = signal(false);
  readonly docPanelVisible = signal(false);
  readonly docEditRow = signal<number | null>(null);

  readonly certDropdownOpen = signal(false);

  landForm: LandRow = { ...EMPTY_LAND };
  cropForm: CropRow = { ...EMPTY_CROP };
  docForm: DocRow = { ...EMPTY_DOC };
  formData: ProfileFormData = {
    nameWithInitial: '',
    fullName: '',
    fixedPhone: '',
    mobilePhone: '',
    nicPpNo: '',
    address: '',
    region: '',
    city: '',
    fieldOfficer: '',
    gender: '',
    contactPerson: '',
    contactPersonPhone: ''
  };

  constructor() {
    const stateMember = (history.state?.member ?? null) as MemberData | null;
    if (stateMember) {
      this.memberData.set(stateMember);
      this.hydrateEditData(stateMember);
    }
  }

  @HostListener('document:mousedown', ['$event'])
  onDocMouseDown(event: MouseEvent): void {
    const el = this.certDropdownRef?.nativeElement;
    if (el && !el.contains(event.target as Node)) this.certDropdownOpen.set(false);
  }

  goMembers(): void {
    this.router.navigateByUrl('/dashboard/farmer-members');
  }

  portrait(member: MemberData): string {
    return farmerMemberPortraitUrl(member);
  }

  onProfileImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.uploadImage(file);
  }

  uploadImage(file: File): void {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = () => this.profileImage.set((reader.result as string) ?? null);
    reader.readAsDataURL(file);
  }

  onImageDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(false);
    const file = event.dataTransfer?.files?.[0];
    if (file) this.uploadImage(file);
  }

  onImageDragOver(event: DragEvent): void {
    event.preventDefault();
    this.isDragging.set(true);
  }

  removeImage(): void {
    this.profileImage.set(null);
  }

  openNewLand(): void {
    this.landEditRow.set(null);
    this.landForm = { ...EMPTY_LAND };
    this.landPanelOpen.set(true);
    setTimeout(() => this.landPanelVisible.set(true), 0);
  }

  openEditLand(index: number): void {
    const row = this.landRows()[index];
    if (!row) return;
    this.landEditRow.set(index);
    this.landForm = { ...row, certifications: [...row.certifications] };
    this.landPanelOpen.set(true);
    setTimeout(() => this.landPanelVisible.set(true), 0);
  }

  closeLandPanel(): void {
    this.landPanelVisible.set(false);
    setTimeout(() => {
      this.landPanelOpen.set(false);
      this.landEditRow.set(null);
      this.landForm = { ...EMPTY_LAND };
      this.certDropdownOpen.set(false);
    }, DRAWER_ANIM_MS);
  }

  saveLand(): void {
    const idx = this.landEditRow();
    if (idx === null) this.landRows.update((rows) => [...rows, { ...this.landForm }]);
    else this.landRows.update((rows) => rows.map((r, i) => (i === idx ? { ...this.landForm } : r)));
    this.closeLandPanel();
  }

  deleteLand(index: number): void {
    this.landRows.update((rows) => rows.filter((_, i) => i !== index));
  }

  toggleCert(cert: string): void {
    const exists = this.landForm.certifications.includes(cert);
    this.landForm = {
      ...this.landForm,
      certifications: exists ? this.landForm.certifications.filter((c) => c !== cert) : [...this.landForm.certifications, cert]
    };
  }

  openNewCrop(): void {
    this.cropEditRow.set(null);
    this.cropForm = { ...EMPTY_CROP };
    this.cropPanelOpen.set(true);
    setTimeout(() => this.cropPanelVisible.set(true), 0);
  }

  openEditCrop(index: number): void {
    const row = this.cropRows()[index];
    if (!row) return;
    this.cropEditRow.set(index);
    this.cropForm = { ...row };
    this.cropPanelOpen.set(true);
    setTimeout(() => this.cropPanelVisible.set(true), 0);
  }

  closeCropPanel(): void {
    this.cropPanelVisible.set(false);
    setTimeout(() => {
      this.cropPanelOpen.set(false);
      this.cropEditRow.set(null);
      this.cropForm = { ...EMPTY_CROP };
    }, DRAWER_ANIM_MS);
  }

  saveCrop(): void {
    const idx = this.cropEditRow();
    if (idx === null) this.cropRows.update((rows) => [...rows, { ...this.cropForm }]);
    else this.cropRows.update((rows) => rows.map((r, i) => (i === idx ? { ...this.cropForm } : r)));
    this.closeCropPanel();
  }

  deleteCrop(index: number): void {
    this.cropRows.update((rows) => rows.filter((_, i) => i !== index));
  }

  openNewDoc(): void {
    this.docEditRow.set(null);
    this.docForm = { ...EMPTY_DOC };
    this.docPanelOpen.set(true);
    setTimeout(() => this.docPanelVisible.set(true), 0);
  }

  openEditDoc(index: number): void {
    const row = this.docRows()[index];
    if (!row) return;
    this.docEditRow.set(index);
    this.docForm = { ...row };
    this.docPanelOpen.set(true);
    setTimeout(() => this.docPanelVisible.set(true), 0);
  }

  closeDocPanel(): void {
    this.docPanelVisible.set(false);
    setTimeout(() => {
      this.docPanelOpen.set(false);
      this.docEditRow.set(null);
      this.docForm = { ...EMPTY_DOC };
    }, DRAWER_ANIM_MS);
  }

  onDocFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.docForm = {
      ...this.docForm,
      fileName: file.name,
      fileSize: `${(file.size / 1024 / 1024).toFixed(1)} MB`
    };
  }

  saveDoc(): void {
    const idx = this.docEditRow();
    const now = new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
    const entry: DocRow = { ...this.docForm, uploadDate: this.docForm.uploadDate || now };
    if (idx === null) this.docRows.update((rows) => [...rows, entry]);
    else this.docRows.update((rows) => rows.map((r, i) => (i === idx ? entry : r)));
    this.closeDocPanel();
  }

  deleteDoc(index: number): void {
    this.docRows.update((rows) => rows.filter((_, i) => i !== index));
  }

  private hydrateEditData(member: MemberData): void {
    const parts = member.fullName.split(' ');
    const initials = `${parts.map((p) => p[0]).join('. ')}.`;
    this.formData = {
      ...this.formData,
      nameWithInitial: `${initials} ${parts[parts.length - 1]}`,
      fullName: member.fullName,
      mobilePhone: member.phone,
      nicPpNo: member.nationalId,
      address: member.village,
      region: 'Cambodia',
      city: member.village.replace(' Village', ''),
      gender: member.gender.toLowerCase()
    };
    this.profileImage.set(farmerMemberPortraitUrl(member));
    this.landRows.set([{ name: 'North Rice Field', extend: '5.2', status: 'Active', certifications: ['USDA-NOP'] }]);
    this.cropRows.set([{ landName: 'North Rice Field', cropName: 'Rice', yield: '3.5 tons/ha', plants: 'N/A' }]);
    this.docRows.set([
      { docName: 'Land Certificate', landName: 'North Rice Field', uploadDate: 'Mar 15, 2024', fileSize: '2.3 MB', fileName: 'land_certificate.pdf' },
      { docName: 'Meeting Minutes - 2026', landName: '—', uploadDate: 'Feb 2, 2026', fileSize: '1.1 MB', fileName: 'meeting_minutes_2026.pdf' }
    ]);
  }
}
