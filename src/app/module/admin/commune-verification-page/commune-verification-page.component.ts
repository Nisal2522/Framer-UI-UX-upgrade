import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '@/app/core/service/notification.service';

type QueueItem = {
  id: string;
  acName: string;
  acCode: string;
  commune: string;
  district: string;
  province: string;
  pendingReason: 'initial' | 'reverification';
  submittedAt: string;
};

type VerificationLog = {
  id: string;
  at: string;
  action: 'approved' | 'returned';
  acCode: string;
  acName: string;
  comment: string;
};

@Component({
  selector: 'app-commune-verification-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './commune-verification-page.component.html',
  styleUrl: './commune-verification-page.component.scss',
})
export class CommuneVerificationPageComponent {
  private readonly notifications = inject(NotificationService);

  readonly queue = signal<QueueItem[]>([
    {
      id: 'vq-1',
      acName: 'Anlong Vil Rice Growers Cooperative',
      acCode: 'AC-BB-2024-089',
      commune: 'Anlong Vil',
      district: 'Sangkae',
      province: 'Battambang',
      pendingReason: 'initial',
      submittedAt: '2026-03-28'
    },
    {
      id: 'vq-2',
      acName: 'Stueng Saen Horticulture AC',
      acCode: 'AC-KT-2025-012',
      commune: 'Stueng Saen',
      district: 'Stueng Saen',
      province: 'Kampong Thom',
      pendingReason: 'reverification',
      submittedAt: '2026-03-30'
    }
  ]);

  readonly selectedId = signal<string | null>('vq-1');
  readonly sectionNotes = signal<Record<string, string>>({
    identity: '',
    governance: '',
    operations: ''
  });
  readonly logs = signal<VerificationLog[]>([]);

  readonly returnComment = signal('');
  readonly errorText = signal('');

  readonly selected = computed(() => this.queue().find((item) => item.id === this.selectedId()) ?? null);

  readonly sectionKeys = [
    { key: 'identity', title: 'Legal identity & registration' },
    { key: 'governance', title: 'Governance & committee' },
    { key: 'operations', title: 'Operations & membership rules' }
  ];

  setSectionNote(key: string, value: string): void {
    this.sectionNotes.update((notes) => ({ ...notes, [key]: value }));
  }

  approve(id: string): void {
    const target = this.queue().find((item) => item.id === id);
    if (!target) return;

    this.logs.update((rows) => [
      {
        id: `log-${Date.now()}`,
        at: new Date().toISOString(),
        action: 'approved',
        acCode: target.acCode,
        acName: target.acName,
        comment: 'Profile approved by commune officer.'
      },
      ...rows
    ]);
    this.notifications.addNotification({
      title: `Profile approved: ${target.acCode}`,
      body: `${target.acName} is now active.`,
      audience: 'AC Committee'
    });
    this.removeFromQueue(id);
    this.errorText.set('');
  }

  returnToCommittee(id: string): void {
    const target = this.queue().find((item) => item.id === id);
    if (!target) return;

    const comment = this.returnComment().trim();
    if (!comment) {
      this.errorText.set('Return requires mandatory written comments.');
      return;
    }

    this.logs.update((rows) => [
      {
        id: `log-${Date.now()}`,
        at: new Date().toISOString(),
        action: 'returned',
        acCode: target.acCode,
        acName: target.acName,
        comment
      },
      ...rows
    ]);
    this.notifications.addNotification({
      title: `Profile returned: ${target.acCode}`,
      body: comment,
      audience: 'AC Committee'
    });
    this.returnComment.set('');
    this.errorText.set('');
    this.removeFromQueue(id);
  }

  private removeFromQueue(id: string): void {
    this.queue.update((items) => items.filter((item) => item.id !== id));
    const next = this.queue()[0]?.id ?? null;
    this.selectedId.set(next);
    this.sectionNotes.set({});
  }
}
