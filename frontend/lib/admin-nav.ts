import type { SessionUser } from '@/lib/types';
import {
  ADMIN_CONTROL_PATH,
  HOME_PATH,
  REPORT_MANAGEMENT_PATH,
  SYSTEM_DASHBOARD_PATH,
} from '@/lib/post-login-redirect';

export type AdminNavSectionId = 'administration' | 'public' | 'account';

export interface AdminNavItem {
  id: string;
  href: string;
  label: string;
  icon: string;
  section: AdminNavSectionId;
  isVisible?: (session: SessionUser) => boolean;
}

export const ADMIN_NAV_SECTION_LABELS: Record<AdminNavSectionId, string> = {
  administration: 'Administration',
  public: 'Public services',
  account: 'Account',
};

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    id: 'dashboard',
    href: SYSTEM_DASHBOARD_PATH,
    label: 'Dashboard',
    icon: 'fa-tachometer-alt',
    section: 'administration',
  },
  {
    id: 'reports',
    href: REPORT_MANAGEMENT_PATH,
    label: 'Report management',
    icon: 'fa-clipboard-list',
    section: 'administration',
    isVisible: (session) => session.authSource !== 'cognito',
  },
  {
    id: 'authorities',
    href: ADMIN_CONTROL_PATH,
    label: 'Authorities',
    icon: 'fa-user-shield',
    section: 'administration',
    isVisible: (session) => session.type === 'Application Admin',
  },
  {
    id: 'report',
    href: '/public',
    label: 'Report an issue',
    icon: 'fa-exclamation-circle',
    section: 'public',
  },
  {
    id: 'status',
    href: '/status',
    label: 'Check status',
    icon: 'fa-search',
    section: 'public',
  },
  {
    id: 'statistics',
    href: '/statistics',
    label: 'Statistics',
    icon: 'fa-chart-bar',
    section: 'public',
  },
  {
    id: 'home',
    href: HOME_PATH,
    label: 'Home',
    icon: 'fa-home',
    section: 'account',
  },
];

export function getVisibleAdminNavItems(session: SessionUser): AdminNavItem[] {
  return ADMIN_NAV_ITEMS.filter((item) => !item.isVisible || item.isVisible(session));
}

export function isAdminNavItemActive(pathname: string, href: string): boolean {
  if (href === SYSTEM_DASHBOARD_PATH) {
    return pathname === SYSTEM_DASHBOARD_PATH;
  }
  return pathname === href || pathname.startsWith(`${href}/`);
}
