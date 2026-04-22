import { TestBed } from '@angular/core/testing';
import { MaybeAsync } from '@angular/router';
import { Router, provideRouter } from '@angular/router';
import { GuardResult } from '@angular/router';
import { firstValueFrom, isObservable, of } from 'rxjs';
import { ADMIN_PATHS, APP_PATHS, COOPERATIVE_PATHS } from '@/app/core/config/app-paths';
import { AuthService } from '@/app/core/service/auth.service';
import { adminOnlyGuard, authGuard, cooperativeOnlyGuard } from './auth.guards';

class AuthServiceMock {
  validateStoredSession = vi.fn().mockReturnValue(of(true));
  isGovernmentAdmin = vi.fn().mockReturnValue(false);
}

async function resolveGuardResult(result: MaybeAsync<GuardResult>): Promise<GuardResult> {
  if (isObservable(result)) {
    return firstValueFrom(result);
  }
  return Promise.resolve(result);
}

describe('auth guards', () => {
  let router: Router;
  let auth: AuthServiceMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter([]), { provide: AuthService, useClass: AuthServiceMock }]
    });
    router = TestBed.inject(Router);
    auth = TestBed.inject(AuthService) as unknown as AuthServiceMock;
  });

  it('authGuard allows valid session', async () => {
    auth.validateStoredSession.mockReturnValue(of(true));
    const result = await TestBed.runInInjectionContext(() => resolveGuardResult(authGuard({} as never, {} as never)));
    expect(result).toBe(true);
  });

  it('authGuard redirects when session is invalid', async () => {
    auth.validateStoredSession.mockReturnValue(of(false));
    const result = await TestBed.runInInjectionContext(() => resolveGuardResult(authGuard({} as never, {} as never)));
    expect(result).toEqual(router.createUrlTree([`/${APP_PATHS.login}`]));
  });

  it('adminOnlyGuard redirects cooperative users to dashboard', async () => {
    auth.validateStoredSession.mockReturnValue(of(true));
    auth.isGovernmentAdmin.mockReturnValue(false);
    const result = await TestBed.runInInjectionContext(() => resolveGuardResult(adminOnlyGuard({} as never, {} as never)));
    expect(result).toEqual(router.createUrlTree([COOPERATIVE_PATHS.home]));
  });

  it('cooperativeOnlyGuard redirects admins to admin dashboard', async () => {
    auth.validateStoredSession.mockReturnValue(of(true));
    auth.isGovernmentAdmin.mockReturnValue(true);
    const result = await TestBed.runInInjectionContext(() =>
      resolveGuardResult(cooperativeOnlyGuard({} as never, {} as never))
    );
    expect(result).toEqual(router.createUrlTree([ADMIN_PATHS.home]));
  });
});

