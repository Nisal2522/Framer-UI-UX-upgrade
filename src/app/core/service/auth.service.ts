import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable, catchError, map, of, tap } from 'rxjs';

export const PORTAL_USER_STORAGE_KEY = 'agrico_portal_user';

export type PortalRole = 'cooperative' | 'government_admin';

export type PortalUser = {
  role: PortalRole;
  email: string;
  accessToken: string;
  expiresAt: number;
};

type AuthSessionResponse = {
  role: PortalRole;
  email: string;
  accessToken: string;
  expiresAt: number;
};

type PreferredRole = 'admin' | 'cooperative';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly backendAuthToggleKey = 'use_backend_auth';
  private readonly http = inject(HttpClient);
  private readonly userState = signal<PortalUser | null>(this.readPortalUser());

  readonly user$ = toObservable(this.userState);
  readonly isAuthenticated = computed(() => this.userState() !== null);

  getPortalUser(): PortalUser | null {
    return this.userState();
  }

  hasPortalUser(): boolean {
    const user = this.getPortalUser();
    return user !== null && user.expiresAt > Date.now();
  }

  isGovernmentAdmin(): boolean {
    return this.getPortalUser()?.role === 'government_admin';
  }

  setPortalUser(user: PortalUser): void {
    localStorage.setItem(PORTAL_USER_STORAGE_KEY, JSON.stringify(user));
    this.userState.set(user);
  }

  clearPortalUser(): void {
    localStorage.removeItem(PORTAL_USER_STORAGE_KEY);
    this.userState.set(null);
  }

  login(email: string, password: string, preferredRole: PreferredRole = 'cooperative'): Observable<PortalUser> {
    const normalizedEmail = email.trim();
    if (!this.shouldUseBackendAuth()) {
      const role = preferredRole === 'admin' ? 'government_admin' : 'cooperative';
      const fallbackEmail = normalizedEmail || (role === 'government_admin' ? 'admin@maff.gov.kh' : 'user@coop.local');
      const fallbackUser: PortalUser = {
        role,
        email: fallbackEmail,
        accessToken: `local-dev-${Math.random().toString(36).slice(2)}`,
        expiresAt: Date.now() + 1000 * 60 * 60 * 24
      };
      this.setPortalUser(fallbackUser);
      return of(fallbackUser);
    }

    return this.http
      .post<AuthSessionResponse>('/api/auth/login', {
        email: normalizedEmail,
        password
      })
      .pipe(
        map((response) => this.mapSession(response)),
        catchError((error: HttpErrorResponse) => {
          if (this.isBackendUnavailable(error)) {
            const role = preferredRole === 'admin' ? 'government_admin' : 'cooperative';
            const fallbackEmail =
              normalizedEmail || (role === 'government_admin' ? 'admin@maff.gov.kh' : 'user@coop.local');
            const fallbackUser: PortalUser = {
              role,
              email: fallbackEmail,
              accessToken: `local-dev-${Math.random().toString(36).slice(2)}`,
              expiresAt: Date.now() + 1000 * 60 * 60 * 24
            };
            return of(fallbackUser);
          }
          throw error;
        }),
        tap((user) => this.setPortalUser(user))
      );
  }

  validateStoredSession(): Observable<boolean> {
    const user = this.getPortalUser();
    if (!user || user.expiresAt <= Date.now()) {
      this.clearPortalUser();
      return of(false);
    }

    if (!this.shouldUseBackendAuth()) {
      return of(true);
    }

    return this.http.get<AuthSessionResponse>('/api/auth/session').pipe(
      map((response) => this.mapSession(response)),
      tap((nextUser) => this.setPortalUser(nextUser)),
      map(() => true),
      catchError((error: HttpErrorResponse) => {
        if (this.isBackendUnavailable(error)) {
          // Dev fallback: keep valid local session when auth API isn't wired yet.
          return of(true);
        }
        this.clearPortalUser();
        return of(false);
      })
    );
  }

  private isBackendUnavailable(error: HttpErrorResponse): boolean {
    return error.status === 0 || error.status === 404 || error.status === 501 || error.status === 503;
  }

  private shouldUseBackendAuth(): boolean {
    return localStorage.getItem(this.backendAuthToggleKey) === 'true';
  }

  private mapSession(response: AuthSessionResponse): PortalUser {
    return {
      role: response.role,
      email: response.email,
      accessToken: response.accessToken,
      expiresAt: response.expiresAt
    };
  }

  private readPortalUser(): PortalUser | null {
    const raw = localStorage.getItem(PORTAL_USER_STORAGE_KEY);
    if (!raw) return null;

    try {
      const parsed = JSON.parse(raw) as Partial<PortalUser>;
      if (parsed.role !== 'cooperative' && parsed.role !== 'government_admin') return null;
      if (typeof parsed.email !== 'string') return null;
      if (typeof parsed.accessToken !== 'string' || parsed.accessToken.length === 0) return null;
      if (typeof parsed.expiresAt !== 'number') return null;
      return {
        role: parsed.role,
        email: parsed.email,
        accessToken: parsed.accessToken,
        expiresAt: parsed.expiresAt
      };
    } catch {
      return null;
    }
  }
}
