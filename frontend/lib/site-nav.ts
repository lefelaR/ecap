/** Routes that use the admin shell (side nav) instead of the top nav. */
export const ADMIN_PATH_PREFIX = '/admin';

/**
 * Routes that require sign-in. These use the admin area or authenticated flows,
 * not the public top navigation.
 */
const AUTH_REQUIRED_PREFIXES = ['/public', '/statistics'] as const;

/** Public routes that show the top navigation bar. */
const PUBLIC_TOP_NAV_PREFIXES = ['/', '/status', '/authentication', '/login'] as const;

function matchesRoute(pathname: string, prefix: string): boolean {
  if (prefix === '/') {
    return pathname === '/';
  }
  return pathname === prefix || pathname.startsWith(`${prefix}/`);
}

export function isAdminRoute(pathname: string): boolean {
  return pathname === ADMIN_PATH_PREFIX || pathname.startsWith(`${ADMIN_PATH_PREFIX}/`);
}

export function isAuthRequiredRoute(pathname: string): boolean {
  return AUTH_REQUIRED_PREFIXES.some((prefix) => matchesRoute(pathname, prefix));
}

export function shouldShowTopNav(pathname: string): boolean {
  if (isAdminRoute(pathname) || isAuthRequiredRoute(pathname)) {
    return false;
  }
  return PUBLIC_TOP_NAV_PREFIXES.some((prefix) => matchesRoute(pathname, prefix));
}
