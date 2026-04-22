export const APP_PATHS = {
  root: '',
  login: 'login',
  dashboard: 'dashboard',
  dashboardAdmin: 'dashboard/admin'
} as const;

export const COOPERATIVE_PATHS = {
  home: '/dashboard',
  acProfile: '/dashboard/ac-profile',
  committeeStructure: '/dashboard/committee-structure',
  farmerMembers: '/dashboard/farmer-members',
  farmerMembersNew: '/dashboard/farmer-members/new',
  farmerMembersEdit: '/dashboard/farmer-members/edit/:memberId',
  businessPlans: '/dashboard/business-plans',
  businessPlansNew: '/dashboard/business-plans/new',
  assets: '/dashboard/assets',
  knowledge: '/dashboard/knowledge',
  calendarHarvestingPlanning: '/dashboard/calendar/harvesting-planning',
  calendarTraining: '/dashboard/calendar/training',
  reports: '/dashboard/reports'
} as const;

export const COOPERATIVE_ROUTE_SEGMENTS = {
  home: '',
  acProfile: 'ac-profile',
  committeeStructure: 'committee-structure',
  farmerMembers: 'farmer-members',
  farmerMembersNew: 'farmer-members/new',
  farmerMembersEdit: 'farmer-members/edit/:memberId',
  businessPlans: 'business-plans',
  businessPlansNew: 'business-plans/new',
  assets: 'assets',
  knowledge: 'knowledge',
  calendarHarvestingPlanning: 'calendar/harvesting-planning',
  calendarTraining: 'calendar/training',
  reports: 'reports',
  admin: 'admin'
} as const;

export const ADMIN_PATHS = {
  home: '/dashboard/admin',
  provincial: '/dashboard/admin/provincial',
  communeVerification: '/dashboard/admin/commune-verification',
  businessPlans: '/dashboard/admin/business-plans',
  progressReporting: '/dashboard/admin/progress-reporting',
  knowledge: '/dashboard/admin/knowledge',
  reporting: '/dashboard/admin/reporting'
} as const;

export const ADMIN_ROUTE_SEGMENTS = {
  home: '',
  provincial: 'provincial',
  communeVerification: 'commune-verification',
  businessPlans: 'business-plans',
  progressReporting: 'progress-reporting',
  knowledge: 'knowledge',
  reporting: 'reporting'
} as const;

