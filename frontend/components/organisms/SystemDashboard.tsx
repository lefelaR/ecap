'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  ADMIN_CONTROL_PATH,
  REPORT_MANAGEMENT_PATH,
  SYSTEM_DASHBOARD_PATH,
} from '@/lib/post-login-redirect';
import type { PublicStats } from '@/lib/types';
import { dashboardApi } from '@/services/dashboard/client';
import { ActionCard } from '@/components/atoms/ActionCard';
import { AlertMessage } from '@/components/atoms/AlertMessage';
import { DashboardSummaryBar } from '@/components/molecules/DashboardSummaryBar';
import { useSession } from '@/components/organisms/SessionProvider';

export function SystemDashboard() {
  const router = useRouter();
  const { session, ready } = useSession();
  const [summary, setSummary] = useState<PublicStats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!ready) return;

    if (!session) {
      router.push(`/authentication/login?redirect=${encodeURIComponent(SYSTEM_DASHBOARD_PATH)}`);
      return;
    }

    dashboardApi
      .getSummary()
      .then(setSummary)
      .catch(() => setError('Failed to load system summary.'));
  }, [ready, router, session]);

  if (!ready || !session) {
    return <p>Loading dashboard…</p>;
  }

  const isAuthorityUser = session.authSource !== 'cognito';
  const isApplicationAdmin = session.type === 'Application Admin';

  return (
    <>
      <p className="lead mb-1">
        Welcome back, <strong>{session.name}</strong>
      </p>
      <p className="text-muted small mb-4">
        {isAuthorityUser
          ? `${session.type}${session.ward && session.ward !== 'All' ? ` · ${session.ward}` : ''} · ${session.municipality || 'ECAP'}`
          : 'Citizen account · report issues and track service delivery'}
      </p>

      {error && <AlertMessage message={error} className="mb-4" />}
      {summary && <DashboardSummaryBar summary={summary} />}

      <h2 className="h5 mb-3">Quick actions</h2>
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        <ActionCard
          title="Report an issue"
          description="Submit a service delivery or crime report with map pin, photos, and contact details."
          href="/public"
          buttonLabel="Report an Issue"
          buttonClass="btn btn-primary"
        />
        <ActionCard
          title="Check status"
          description="Look up a reference number to see resolution progress and expenditure."
          href="/status"
          buttonLabel="Check Status"
        />
        <ActionCard
          title="Service statistics"
          description="View trends, hotspot wards, and transparent reporting across the municipality."
          href="/statistics"
          buttonLabel="View Statistics"
        />
        {isAuthorityUser && (
          <ActionCard
            title="Manage reports"
            description="Review ward reports, resolve issues, mark duplicates, and track expenditure."
            href={REPORT_MANAGEMENT_PATH}
            buttonLabel="Open report management"
            buttonClass="btn btn-outline-primary"
          />
        )}
        {isApplicationAdmin && (
          <ActionCard
            title="Authority registration"
            description="Register authorities, assign area-limited rights, and preserve data integrity."
            href={ADMIN_CONTROL_PATH}
            buttonLabel="Admin control"
            buttonClass="btn btn-outline-success"
          />
        )}
      </div>

      {summary && summary.hotspotWards.length > 0 && (
        <section className="card shadow-sm mt-4">
          <div className="card-body">
            <h2 className="h5">Hotspot wards</h2>
            <ul className="mb-0">
              {summary.hotspotWards.slice(0, 5).map((entry) => (
                <li key={entry.ward}>
                  {entry.ward}: {entry.count} open report{entry.count === 1 ? '' : 's'}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

    </>
  );
}
