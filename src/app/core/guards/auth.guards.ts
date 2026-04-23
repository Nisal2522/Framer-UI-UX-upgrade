import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { ADMIN_PATHS, APP_PATHS, COOPERATIVE_PATHS } from '@/app/core/config/app-paths';
import { AuthService } from '@/app/core/service/auth.service';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.validateStoredSession().pipe(
    map((valid) => {
      if (valid) return true;
      return router.createUrlTree([`/${APP_PATHS.login}`]);
    })
  );
};

export const adminOnlyGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.validateStoredSession().pipe(
    map((valid) => {
      if (!valid) return router.createUrlTree([`/${APP_PATHS.login}`]);
      return auth.isGovernmentAdmin() ? true : router.createUrlTree([COOPERATIVE_PATHS.home]);
    })
  );
};

export const adminOnlyMatchGuard: CanMatchFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.validateStoredSession().pipe(
    map((valid) => {
      if (!valid) return router.createUrlTree([`/${APP_PATHS.login}`]);
      return auth.isGovernmentAdmin() ? true : router.createUrlTree([COOPERATIVE_PATHS.home]);
    })
  );
};

export const cooperativeOnlyGuard: CanActivateFn = (_route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.validateStoredSession().pipe(
    map((valid) => {
      if (!valid) return router.createUrlTree([`/${APP_PATHS.login}`]);
      if (!auth.isGovernmentAdmin()) return true;
      // Prevent redirect loops when admin routes are nested under dashboard children.
      if (state.url.startsWith(ADMIN_PATHS.home)) return true;
      return router.createUrlTree([ADMIN_PATHS.home]);
    })
  );
};
