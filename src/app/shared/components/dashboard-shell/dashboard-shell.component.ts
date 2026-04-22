import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, ElementRef, HostListener, ViewChild, computed, effect, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { ADMIN_PATHS, APP_PATHS, COOPERATIVE_PATHS } from '@/app/core/config/app-paths';
import { AuthService } from '@/app/core/service/auth.service';
import { NotificationService } from '@/app/core/service/notification.service';
import { ChatbotWidgetComponent } from '@/app/shared/components/chatbot-widget/chatbot-widget.component';

type LangCode = 'EN' | 'KH' | 'FR' | 'ZH' | 'TH';

type NavItem = {
  name: string;
  path: string;
  icon: string;
  end?: boolean;
};

type CooperativeNavEntry =
  | { kind: 'link'; name: string; path: string; icon: string; end?: boolean }
  | {
      kind: 'calendar';
      name: string;
      icon: string;
      children: { name: string; path: string }[];
    };

@Component({
  selector: 'app-dashboard-shell',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ChatbotWidgetComponent],
  templateUrl: './dashboard-shell.component.html',
  styleUrl: './dashboard-shell.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardShellComponent {
  private readonly router = inject(Router);
  private readonly auth = inject(AuthService);
  private readonly notificationService = inject(NotificationService);

  @ViewChild('languageMenuRef') private languageMenuRef?: ElementRef<HTMLElement>;
  @ViewChild('notifRef') private notifRef?: ElementRef<HTMLElement>;

  readonly sidebarOpen = signal(false);
  readonly desktopSidebarCollapsed = signal(false);
  readonly selectedLanguage = signal<LangCode>('EN');
  readonly languageMenuOpen = signal(false);
  readonly notifOpen = signal(false);
  readonly calendarExpanded = signal(this.router.url.startsWith('/dashboard/calendar'));

  readonly profileImageUrl =
    'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?auto=format&fit=crop&w=160&h=160&q=80';

  readonly languageOptions: { code: LangCode; label: string; native: string }[] = [
    { code: 'EN', label: 'English', native: 'English' },
    { code: 'KH', label: 'Khmer', native: 'ភាសាខ្មែរ' },
    { code: 'FR', label: 'French', native: 'Français' },
    { code: 'ZH', label: 'Chinese', native: '中文' },
    { code: 'TH', label: 'Thai', native: 'ภาษาไทย' }
  ];

  readonly cooperativeNav: CooperativeNavEntry[] = [
    { kind: 'link', name: 'AC Dashboard', path: COOPERATIVE_PATHS.home, icon: 'bi-grid-1x2-fill', end: true },
    { kind: 'link', name: 'AC Profile', path: COOPERATIVE_PATHS.acProfile, icon: 'bi-buildings-fill' },
    { kind: 'link', name: 'Committee Structure', path: COOPERATIVE_PATHS.committeeStructure, icon: 'bi-person-badge' },
    { kind: 'link', name: 'Members', path: COOPERATIVE_PATHS.farmerMembers, icon: 'bi-people-fill' },
    { kind: 'link', name: 'Assets', path: COOPERATIVE_PATHS.assets, icon: 'bi-box-seam-fill' },
    { kind: 'link', name: 'Business Plans', path: COOPERATIVE_PATHS.businessPlans, icon: 'bi-file-text-fill' },
    {
      kind: 'calendar',
      name: 'Calendar',
      icon: 'bi-calendar3',
      children: [
        { name: 'Planting and Harvesting', path: COOPERATIVE_PATHS.calendarHarvestingPlanning },
        { name: 'Training', path: COOPERATIVE_PATHS.calendarTraining }
      ]
    },
    { kind: 'link', name: 'Knowledge Hub', path: COOPERATIVE_PATHS.knowledge, icon: 'bi-book-fill' }
  ];

  readonly adminNavigation: NavItem[] = [
    { name: 'National Dashboard', path: ADMIN_PATHS.home, icon: 'bi-grid-1x2-fill', end: true },
    { name: 'Commune Verification', path: ADMIN_PATHS.communeVerification, icon: 'bi-person-check-fill' },
    { name: 'Business Plan', path: ADMIN_PATHS.businessPlans, icon: 'bi-file-text-fill' },
    { name: 'Progress Reporting', path: ADMIN_PATHS.progressReporting, icon: 'bi-activity' },
    { name: 'Knowledge Hub', path: ADMIN_PATHS.knowledge, icon: 'bi-book-fill' },
    { name: 'GESI / Reporting', path: ADMIN_PATHS.reporting, icon: 'bi-bar-chart-fill' }
  ];

  readonly portalUser = toSignal(this.auth.user$, { initialValue: this.auth.getPortalUser() });
  readonly isAdmin = computed(() => this.portalUser()?.role === 'government_admin');
  readonly unreadCount = toSignal(this.notificationService.unreadCount$, { initialValue: 0 });
  readonly notificationsList = toSignal(this.notificationService.notifications$, { initialValue: [] });
  readonly currentPath = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.router.url),
      startWith(this.router.url)
    ),
    { initialValue: this.router.url }
  );

  constructor() {
    effect(() => {
      const admin = this.isAdmin();
      const path = this.currentPath();

      if (admin && path.startsWith('/dashboard/') && !path.startsWith('/dashboard/admin')) {
        this.router.navigateByUrl(ADMIN_PATHS.home);
      }

      if (!admin && path.startsWith('/dashboard/admin')) {
        this.router.navigateByUrl(COOPERATIVE_PATHS.home);
      }

      if (path.startsWith('/dashboard/calendar')) {
        this.calendarExpanded.set(true);
      }
    });
  }

  logout(): void {
    this.auth.clearPortalUser();
    this.router.navigateByUrl(`/${APP_PATHS.login}`);
  }

  isCalendarActive(): boolean {
    return this.currentPath().startsWith('/dashboard/calendar');
  }

  onCalendarToggle(): void {
    if (this.desktopSidebarCollapsed()) {
      this.desktopSidebarCollapsed.set(false);
      this.calendarExpanded.set(true);
      return;
    }
    this.calendarExpanded.set(!this.calendarExpanded());
  }

  toggleNotifications(): void {
    const next = !this.notifOpen();
    if (next && this.unreadCount() > 0) {
      this.notificationService.markAllRead();
    }
    this.notifOpen.set(next);
  }

  onLanguageChange(code: LangCode): void {
    this.selectedLanguage.set(code);
    this.languageMenuOpen.set(false);
  }

  @HostListener('document:pointerdown', ['$event'])
  onDocumentPointerDown(event: PointerEvent): void {
    const target = event.target as Node;
    const langEl = this.languageMenuRef?.nativeElement;
    const notifEl = this.notifRef?.nativeElement;

    if (this.languageMenuOpen() && langEl && !langEl.contains(target)) {
      this.languageMenuOpen.set(false);
    }

    if (this.notifOpen() && notifEl && !notifEl.contains(target)) {
      this.notifOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.languageMenuOpen.set(false);
    this.notifOpen.set(false);
  }
}
