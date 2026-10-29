'use client';

import { useCallback, useEffect, useState } from 'react';
import { CATEGORY_LABELS, STATUS_LABELS } from '@/lib/labels';
import type { Report } from '@/lib/types';
import { dashboardApi } from '@/services/dashboard/client';
import { LoadingSpinner } from '@/lib/react-spinners';
import { AlertMessage } from '@/components/atoms/AlertMessage';
import { IssuesTable } from '@/components/molecules/IssuesTable';
import { PaginatedDataTable } from '@/components/molecules/PaginatedDataTable';

interface ReportedIssuesSectionProps {
  isAuthorityUser: boolean;
  embedded?: boolean;
}

export function ReportedIssuesSection({ isAuthorityUser, embedded = false }: ReportedIssuesSectionProps) {
  const [reports, setReports] = useState<Report[]>([]);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');

    dashboardApi
      .getReports({ status: statusFilter || undefined })
      .then(setReports)
      .catch(() => setError('Failed to load reported issues.'))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  const getSearchableText = useCallback(
    (report: Report) =>
      [
        report.referenceNumber,
        report.summary,
        report.ward,
        CATEGORY_LABELS[report.category],
        STATUS_LABELS[report.status],
        report.anonymous ? 'anonymous' : '',
      ].join(' '),
    [],
  );

  return (
    <section className={embedded ? undefined : 'card shadow-sm mt-4'}>
      <div className={embedded ? undefined : 'card-body'}>
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
          {!embedded && (
            <div>
              <h2 className="h5 mb-1">Reported issues</h2>
              <p className="text-muted small mb-0">
                {isAuthorityUser
                  ? 'All issues in your jurisdiction.'
                  : 'All issues you have previously reported.'}
              </p>
            </div>
          )}
        </div>

        {error && <AlertMessage message={error} className="mb-3" />}

        {loading ? (
          <LoadingSpinner message="Loading reported issues…" />
        ) : reports.length === 0 ? (
          <AlertMessage
            message={
              isAuthorityUser
                ? 'No reported issues match your filters.'
                : 'You have not reported any issues yet.'
            }
            variant="secondary"
          />
        ) : (
          <div className={embedded ? 'card shadow-sm' : undefined}>
            <div className={embedded ? 'card-body p-0 px-3 pb-3' : undefined}>
              <PaginatedDataTable
                rows={reports}
                getSearchableText={getSearchableText}
                searchId="reported-issues-search"
                searchPlaceholder="Search by reference, summary, ward, or category…"
                noResultsMessage="No issues match your search."
                toolbarExtra={
                  <div className="table-toolbar__filters ms-md-auto" style={{ minWidth: 200 }}>
                    <select
                      className="form-select form-select-sm"
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
                }
              >
                {(paginatedReports) => <IssuesTable reports={paginatedReports} />}
              </PaginatedDataTable>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
