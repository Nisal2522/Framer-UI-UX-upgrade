import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CooperativeLocationMapComponent } from '@/app/module/cooperate/cooperative-location-map/cooperative-location-map.component';

type DossierDocRow = {
  id: string;
  name: string;
  uploadDate: string;
  fileSize: string;
};

const DRAWER_ANIM_MS = 200;

function formatDossierFileSize(bytes: number): string {
  if (bytes >= 1024 * 1024) {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return `${Math.max(1, Math.round(bytes / 1024))} KB`;
}

@Component({
  selector: 'app-ac-profile-page',
  standalone: true,
  imports: [CommonModule, FormsModule, CooperativeLocationMapComponent],
  templateUrl: './ac-profile-page.component.html',
  styleUrl: './ac-profile-page.component.scss',
})
export class AcProfilePageComponent {
  @ViewChild('dossierFileInput')
  private readonly dossierFileInput?: ElementRef<HTMLInputElement>;

  readonly tabs = [
    { id: 'cooperative-info', label: 'Cooperative Info' },
    { id: 'dossier', label: 'Dossier' }
  ] as const;

  readonly activeTab = signal<(typeof this.tabs)[number]['id']>('cooperative-info');
  readonly isEditing = signal(false);
  readonly pendingVerification = signal(false);
  readonly dossierDrawerOpen = signal(false);
  readonly dossierDrawerVisible = signal(false);
  readonly dossierDocs = signal<DossierDocRow[]>([
    { id: 'd1', name: 'Constitution', uploadDate: 'Mar 15, 2024', fileSize: '2.3 MB' },
    { id: 'd2', name: 'Meeting Minutes - 2026', uploadDate: 'Feb 2, 2026', fileSize: '1.1 MB' }
  ]);

  readonly profile = signal({
    address: 'Kampong Thom',
    city: 'Baray Commune',
    zip: '06401',
    region: 'Cambodia',
    establishmentDate: '2015-06-15',
    legalStatus: 'registered',
    contactName: 'Sok Pisey',
    contactNumber: '+855 12 345 678',
    email: 'baray.coop@example.com'
  });

  dossierDocName = '';
  selectedFile: File | null = null;
  readonly cooperativeLogoUrl = 'cooperative-logo.svg';

  private drawerCloseTimer: ReturnType<typeof setTimeout> | null = null;

  toggleEditing(): void {
    this.isEditing.set(!this.isEditing());
  }

  openDossierDrawer(): void {
    this.dossierDocName = '';
    this.selectedFile = null;
    this.dossierDrawerOpen.set(true);
    requestAnimationFrame(() => this.dossierDrawerVisible.set(true));
  }

  closeDossierDrawer(): void {
    this.dossierDrawerVisible.set(false);

    if (this.drawerCloseTimer) {
      clearTimeout(this.drawerCloseTimer);
    }

    this.drawerCloseTimer = setTimeout(() => {
      this.dossierDrawerOpen.set(false);
      this.dossierDocName = '';
      this.selectedFile = null;
      if (this.dossierFileInput?.nativeElement) {
        this.dossierFileInput.nativeElement.value = '';
      }
    }, DRAWER_ANIM_MS);
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement | null;
    this.selectedFile = target?.files?.[0] ?? null;
  }

  onFileDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer?.files?.[0] ?? null;
    if (file) this.selectedFile = file;
  }

  onFileDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  openFilePicker(): void {
    this.dossierFileInput?.nativeElement.click();
  }

  removeDossierDoc(docId: string): void {
    this.dossierDocs.update((prev) => prev.filter((doc) => doc.id !== docId));
  }

  submitForVerification(): void {
    this.pendingVerification.set(true);
    this.isEditing.set(false);
  }

  isDossierSubmitDisabled(): boolean {
    return !this.dossierDocName.trim() || !this.selectedFile || this.selectedFile.size > 10 * 1024 * 1024;
  }

  submitDossierDocument(): void {
    const name = this.dossierDocName.trim();
    const file = this.selectedFile;
    if (!name || !file) return;

    const maxBytes = 10 * 1024 * 1024;
    if (file.size > maxBytes) return;

    const uploadDate = new Date().toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });

    this.dossierDocs.update((prev) => [
      ...prev,
      {
        id: `d-${Date.now()}`,
        name,
        uploadDate,
        fileSize: formatDossierFileSize(file.size)
      }
    ]);

    this.closeDossierDrawer();
  }
}
