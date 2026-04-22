import { Routes } from '@angular/router';
import { COOPERATIVE_ROUTE_SEGMENTS } from '@/app/core/config/app-paths';
import { cooperativeOnlyGuard } from '@/app/core/guards/auth.guards';
import { AcDashboardPageComponent } from './ac-dashboard-page/ac-dashboard-page.component';

export const DASHBOARD_ROUTES: Routes = [
  {
    path: '',
    canActivateChild: [cooperativeOnlyGuard],
    children: [
      { path: COOPERATIVE_ROUTE_SEGMENTS.home, component: AcDashboardPageComponent },
      {
        path: COOPERATIVE_ROUTE_SEGMENTS.acProfile,
        loadComponent: () => import('./ac-profile-page/ac-profile-page.component').then((m) => m.AcProfilePageComponent)
      },
      {
        path: COOPERATIVE_ROUTE_SEGMENTS.committeeStructure,
        loadComponent: () =>
          import('./committee-structure-page/committee-structure-page.component').then((m) => m.CommitteeStructurePageComponent),
        data: { title: 'Committee Structure' }
      },
      {
        path: COOPERATIVE_ROUTE_SEGMENTS.farmerMembers,
        loadComponent: () => import('./members-page/members-page.component').then((m) => m.MembersPageComponent),
        data: { title: 'Members' }
      },
      {
        path: COOPERATIVE_ROUTE_SEGMENTS.farmerMembersNew,
        loadComponent: () =>
          import('./member360-form-page/member360-form-page.component').then((m) => m.Member360FormPageComponent)
      },
      {
        path: COOPERATIVE_ROUTE_SEGMENTS.farmerMembersEdit,
        loadComponent: () =>
          import('./member360-form-page/member360-form-page.component').then((m) => m.Member360FormPageComponent)
      },
      {
        path: COOPERATIVE_ROUTE_SEGMENTS.businessPlans,
        loadComponent: () =>
          import('./business-plan-page/business-plan-page.component').then((m) => m.BusinessPlanPageComponent)
      },
      {
        path: COOPERATIVE_ROUTE_SEGMENTS.businessPlansNew,
        loadComponent: () =>
          import('./business-plan-page/business-plan-page.component').then((m) => m.BusinessPlanPageComponent)
      },
      {
        path: COOPERATIVE_ROUTE_SEGMENTS.assets,
        loadComponent: () =>
          import('./asset-management-page/asset-management-page.component').then((m) => m.AssetManagementPageComponent)
      },
      {
        path: COOPERATIVE_ROUTE_SEGMENTS.knowledge,
        loadComponent: () =>
          import('../../shared/components/knowledge-management-page/knowledge-management-page.component').then(
            (m) => m.KnowledgeManagementPageComponent
          )
      },
      {
        path: COOPERATIVE_ROUTE_SEGMENTS.calendarHarvestingPlanning,
        loadComponent: () =>
          import('./calendar-harvesting-planning-page/calendar-harvesting-planning-page.component').then(
            (m) => m.CalendarHarvestingPlanningPageComponent
          )
      },
      {
        path: COOPERATIVE_ROUTE_SEGMENTS.calendarTraining,
        loadComponent: () =>
          import('./calendar-training-page/calendar-training-page.component').then((m) => m.CalendarTrainingPageComponent)
      },
      {
        path: COOPERATIVE_ROUTE_SEGMENTS.reports,
        loadComponent: () => import('../reports-page/reports-page.component').then((m) => m.ReportsPageComponent)
      },
      {
        path: COOPERATIVE_ROUTE_SEGMENTS.admin,
        loadChildren: () => import('../admin/admin.routes').then((m) => m.ADMIN_ROUTES)
      }
    ]
  }
];
