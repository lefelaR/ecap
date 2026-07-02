'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { STATUS_LABELS } from '@/lib/labels';
import { ISSUES_PATH, REPORT_MANAGEMENT_PATH, SYSTEM_DASHBOARD_PATH } from '@/lib/post-login-redirect';
import type { Report } from '@/lib/types';
import { dashboardApi } from '@/services/dashboard/client';
import { LoadingSpinner } from '@/lib/react-spinners';
import { AlertMessage } from '@/components/atoms/AlertMessage';
import { IssueRow } from '@/components/molecules/IssueRow';
import { useSession } from '@/components/organisms/SessionProvider';

export function IssuesPanel() {
  const router = useRouter();
  const { session, ready } = useSession();
  const [reports, setReports] = useState<Report[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isAuthorityUser = session?.authSource !== 'cognito';

  useEffect(() => {
    if (!ready) return;

    if (!session) {
      router.push(`/authentication/login?redirect=${encodeURIComponent(ISSUES_PATH)}`);
      return;
    }

    setLoading(true);
    setError('');

    dashboardApi
      .getReports({ status: statusFilter || undefined })
      .then(setReports)
      .catch(() => setError('Failed to load issues.'))
      .finally(() => setLoading(false));
  }, [ready, router, session, statusFilter]);

  if (!ready || !session) {
    return <LoadingSpinner message="Loading issues…" />;
  }

  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <p className="text-muted small mb-0">
          {isAuthorityUser
            ? 'Issues in your jurisdiction. Open report management to update status and expenditure.'
            : 'Issues you have reported. Select an issue to view its current status.'}
        </p>
        {isAuthorityUser && (
          <Link href={REPORT_MANAGEMENT_PATH} className="btn btn-outline-primary btn-sm">
            Manage reports
          </Link>
        )}
      </div>

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            aria-label="Filter by status"
          >
            <option value="">All statuses</option>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && <AlertMessage message={error} className="mb-4" />}

      {loading ? (
        <LoadingSpinner message="Loading issues…" />
      ) : reports.length === 0 ? (
        <AlertMessage
          message={
            isAuthorityUser
              ? 'No issues match your filters.'
              : 'You have not reported any issues yet.'
          }
          variant="secondary"
        />
      ) : (
        <div className="card shadow-sm">
          <div className="card-body p-0 px-3">
            <div className="list-group list-group-flush">
              {reports.map((report) => (
                <IssueRow key={report.id} report={report} />
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-4">
        <Link href={SYSTEM_DASHBOARD_PATH} className="btn btn-link px-0">
          Back to dashboard
        </Link>
      </div>
    </>
  );
}
