import { Routes } from '@angular/router';
import { APP_PATHS } from '@/app/core/config/app-paths';
import { LandingPageComponent } from '@/app/module/public/landing-page/landing-page.component';

export const PUBLIC_ROUTES: Routes = [
  { path: '', component: LandingPageComponent, pathMatch: 'full' },
  {
    path: APP_PATHS.login,
    loadComponent: () => import('../../auth/login-page/login-page.component').then((m) => m.LoginPageComponent)
  }
];
