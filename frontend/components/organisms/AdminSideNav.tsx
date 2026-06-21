'use client';

import Link from 'next/link';
import { SYSTEM_DASHBOARD_PATH } from '@/lib/post-login-redirect';
import { useSession } from '@/components/organisms/SessionProvider';
import { AdminNavLink } from '@/components/molecules/AdminNavLink';
import { AdminNavSection } from '@/components/molecules/AdminNavSection';
import {
  ADMIN_NAV_SECTION_LABELS,
  type AdminNavSectionId,
  getVisibleAdminNavItems,
} from '@/lib/admin-nav';

const SECTION_ORDER: AdminNavSectionId[] = ['administration', 'public', 'account'];

export function AdminSideNav() {
  const { session, ready, logout } = useSession();

  if (!ready) {
    return <p className="admin-nav__loading text-muted small">Loading navigation…</p>;
  }

  if (!session) {
    return null;
  }

  const visibleItems = getVisibleAdminNavItems(session);

  return (
    <aside className="admin-nav" aria-label="Admin navigation">
      <Link href={SYSTEM_DASHBOARD_PATH} className="admin-nav__brand">
        ECAP
      </Link>

      <div className="admin-nav__profile">
        <p className="admin-nav__profile-name">{session.name}</p>
        <p className="admin-nav__profile-meta">
          {session.authSource === 'cognito' ? 'Citizen account' : session.type}
          {session.ward && session.ward !== 'All' ? ` · ${session.ward}` : ''}
        </p>
      </div>

      {SECTION_ORDER.map((sectionId) => {
        const items = visibleItems.filter((item) => item.section === sectionId);
        if (items.length === 0) return null;

        return (
          <AdminNavSection key={sectionId} title={ADMIN_NAV_SECTION_LABELS[sectionId]}>
            {items.map((item) => (
              <AdminNavLink key={item.id} href={item.href} label={item.label} icon={item.icon} />
            ))}
          </AdminNavSection>
        );
      })}

      <div className="admin-nav__section admin-nav__section--footer">
        <button type="button" className="admin-nav__logout" onClick={() => void logout()}>
          <i className="fas fa-sign-out-alt admin-nav__icon" aria-hidden="true" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
