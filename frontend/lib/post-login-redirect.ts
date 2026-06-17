export const HOME_PATH = '/';
export const REPORT_DASHBOARD_PATH = '/admin';
export const ADMIN_CONTROL_PATH = '/admin/authorities';

export function getPostLoginRedirect(): string {
  return HOME_PATH;
}
