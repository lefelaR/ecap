'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Report } from '@/lib/types';
import {
  ISSUES_PATH,
  REPORT_MANAGEMENT_PATH,
  SYSTEM_DASHBOARD_PATH,
  issueDetailsPath,
} from '@/lib/post-login-redirect';
import { dashboardApi } from '@/services/dashboard/client';
import { LoadingSpinner } from '@/lib/react-spinners';
import { AlertMessage } from '@/components/atoms/AlertMessage';
import { IssueDetailsCard } from '@/components/molecules/IssueDetailsCard';
import { useSession } from '@/components/organisms/SessionProvider';

interface IssueDetailsPanelProps {
  reportId: string;
}

export function IssueDetailsPanel({ reportId }: IssueDetailsPanelProps) {
  const router = useRouter();
  const { session, ready } = useSession();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isAuthorityUser = session?.authSource !== 'cognito';

  useEffect(() => {
    if (!ready) return;

    if (!session) {
      router.push(`/authentication/login?redirect=${encodeURIComponent(issueDetailsPath(reportId))}`);
      return;
    }

    setLoading(true);
    setError('');

    dashboardApi
      .getReport(reportId)
      .then(setReport)
      .catch((err) => {
        const message = err instanceof Error ? err.message : 'Failed to load issue details.';
        setError(message);
        setReport(null);
      })
      .finally(() => setLoading(false));
  }, [ready, router, session, reportId]);

  if (!ready || !session) {
    return <LoadingSpinner message="Loading issue details…" />;
  }

  return (
    <>
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <p className="text-muted small mb-0">
          Full details for this reported issue, including location, status, and resolution information.
        </p>
        {isAuthorityUser && (
          <Link href={REPORT_MANAGEMENT_PATH} className="btn btn-outline-primary btn-sm">
            Manage reports
          </Link>
        )}
      </div>

      {error && <AlertMessage message={error} className="mb-4" />}

      {loading ? (
        <LoadingSpinner message="Loading issue details…" />
      ) : report ? (
        <IssueDetailsCard report={report} />
      ) : !error ? (
        <AlertMessage message="Issue not found." variant="secondary" />
      ) : null}

      <div className="d-flex flex-wrap gap-3 mt-4">
        <Link href={ISSUES_PATH} className="btn btn-link px-0">
          Back to issues
        </Link>
        <Link href={SYSTEM_DASHBOARD_PATH} className="btn btn-link px-0">
          Back to dashboard
        </Link>
        {report && (
          <Link
            href={`/status?reference=${encodeURIComponent(report.referenceNumber)}`}
            className="btn btn-link px-0"
          >
            Public status page
          </Link>
        )}
      </div>
    </>
  );
}
