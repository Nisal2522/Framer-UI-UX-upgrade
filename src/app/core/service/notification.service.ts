/** Replaces the React `NotificationContext` / `useNotifications` pattern for the Angular app. */
import { Injectable, computed, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';

export type AppNotification = {
  id: string;
  title: string;
  body: string;
  createdAt: number;
  audience?: string;
};

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private readonly notificationsState = signal<AppNotification[]>([]);
  private readonly readUpToState = signal<number>(0);

  readonly notifications$ = toObservable(this.notificationsState);
  readonly unreadCountState = computed(() =>
    this.notificationsState().filter((n) => n.createdAt > this.readUpToState()).length
  );
  readonly unreadCount$ = toObservable(this.unreadCountState);

  addNotification(notification: Omit<AppNotification, 'id' | 'createdAt'> & { id?: string }): void {
    const id = notification.id ?? `n-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const nextNotification: AppNotification = {
      id,
      title: notification.title,
      body: notification.body,
      audience: notification.audience,
      createdAt: Date.now()
    };

    this.notificationsState.update((current) => [nextNotification, ...current]);
  }

  markAllRead(): void {
    this.readUpToState.set(Date.now());
  }
}
