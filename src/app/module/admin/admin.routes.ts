import { Routes } from '@angular/router';
import { ADMIN_ROUTE_SEGMENTS } from '@/app/core/config/app-paths';
import { adminOnlyGuard, adminOnlyMatchGuard } from '@/app/core/guards/auth.guards';
import { NationalDashboardPageComponent } from '@/app/module/admin/national-dashboard-page/national-dashboard-page.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    canMatch: [adminOnlyMatchGuard],
    canActivate: [adminOnlyGuard],
    children: [
      { path: ADMIN_ROUTE_SEGMENTS.home, component: NationalDashboardPageComponent },
      {
        path: ADMIN_ROUTE_SEGMENTS.provincial,
        loadComponent: () =>
          import('./provincial-dashboard-page/provincial-dashboard-page.component').then(
            (m) => m.ProvincialDashboardPageComponent
          )
      },
      {
        path: ADMIN_ROUTE_SEGMENTS.communeVerification,
        loadComponent: () =>
          import('./commune-verification-page/commune-verification-page.component').then(
            (m) => m.CommuneVerificationPageComponent
          )
      },
      {
        path: ADMIN_ROUTE_SEGMENTS.businessPlans,
        loadComponent: () =>
          import('./admin-business-plan-workflow-page/admin-business-plan-workflow-page.component').then(
            (m) => m.AdminBusinessPlanWorkflowPageComponent
          )
      },
      {
        path: ADMIN_ROUTE_SEGMENTS.progressReporting,
        loadComponent: () =>
          import('./progress-reporting-admin-page/progress-reporting-admin-page.component').then(
            (m) => m.ProgressReportingAdminPageComponent
          )
      },
      {
        path: ADMIN_ROUTE_SEGMENTS.knowledge,
        loadComponent: () =>
          import('../../shared/components/knowledge-management-page/knowledge-management-page.component').then(
            (m) => m.KnowledgeManagementPageComponent
          )
      },
      {
        path: ADMIN_ROUTE_SEGMENTS.reporting,
        loadComponent: () =>
          import('./admin-reporting-dashboard-page/admin-reporting-dashboard-page.component').then(
            (m) => m.AdminReportingDashboardPageComponent
          )
      }
    ]
  }
];
