'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { ISSUES_PATH, REPORT_MANAGEMENT_PATH, SYSTEM_DASHBOARD_PATH } from '@/lib/post-login-redirect';
import { LoadingSpinner } from '@/lib/react-spinners';
import { ReportedIssuesSection } from '@/components/organisms/ReportedIssuesSection';
import { useSession } from '@/components/organisms/SessionProvider';

export function IssuesPanel() {
  const router = useRouter();
  const { session, ready } = useSession();

  const isAuthorityUser = session?.authSource !== 'cognito';

  useEffect(() => {
    if (!ready) return;

    if (!session) {
      router.push(`/authentication/login?redirect=${encodeURIComponent(ISSUES_PATH)}`);
    }
  }, [ready, router, session]);

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

      <ReportedIssuesSection isAuthorityUser={isAuthorityUser} embedded />

      <div className="mt-4">
        <Link href={SYSTEM_DASHBOARD_PATH} className="btn btn-link px-0">
          Back to dashboard
        </Link>
      </div>
    </>
  );
}
