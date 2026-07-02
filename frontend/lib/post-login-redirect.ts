export const HOME_PATH = '/';
export const SYSTEM_DASHBOARD_PATH = '/admin';
export const ISSUES_PATH = '/admin/issues';

export function issueDetailsPath(id: string): string {
  return `${ISSUES_PATH}/${id}`;
}
export const REPORT_MANAGEMENT_PATH = '/admin/reports';
export const ADMIN_CONTROL_PATH = '/admin/authorities';

/** @deprecated Use SYSTEM_DASHBOARD_PATH */
export const REPORT_DASHBOARD_PATH = SYSTEM_DASHBOARD_PATH;

function isSafeRedirect(path: string | null | undefined): path is string {
  return Boolean(path && path.startsWith('/') && !path.startsWith('//'));
}

export function getPostLoginRedirect(requestedRedirect?: string | null): string {
  if (isSafeRedirect(requestedRedirect)) {
    return requestedRedirect;
  }
  return SYSTEM_DASHBOARD_PATH;
}
