import type { AuthorityType } from './types';

export const REPORT_DASHBOARD_PATH = '/admin';
export const ADMIN_CONTROL_PATH = '/admin/authorities';

export function getPostLoginRedirect(type: AuthorityType, requestedRedirect?: string | null): string {
  if (type !== 'Application Admin') {
    return REPORT_DASHBOARD_PATH;
  }
  return requestedRedirect ?? ADMIN_CONTROL_PATH;
}
