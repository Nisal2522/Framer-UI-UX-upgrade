import { Routes } from '@angular/router';
import { APP_PATHS } from '@/app/core/config/app-paths';
import { authGuard } from '@/app/core/guards/auth.guards';
import { DashboardShellComponent } from '@/app/shared/components/dashboard-shell/dashboard-shell.component';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./module/public/public.routes').then((m) => m.PUBLIC_ROUTES)
  },
  {
    path: APP_PATHS.dashboard,
    component: DashboardShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./module/cooperate/dashboard.routes').then((m) => m.DASHBOARD_ROUTES)
      }
    ]
  },
  {
    path: '**',
    loadComponent: () =>
      import('./error-pages/not-found-page/not-found-page.component').then((m) => m.NotFoundPageComponent)
  }
];
