'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { STATUS_LABELS } from '@/lib/labels';
import type { PublicStats, Report, ReportStatus, SessionUser } from '@/lib/types';
import { dashboardApi } from '@/services/dashboard/client';
import { AlertMessage } from '../atoms/AlertMessage';
import { DashboardSummaryBar } from '../molecules/DashboardSummaryBar';
import { ReportDetailPanel } from '../molecules/ReportDetailPanel';
import { ReportListItem } from '../molecules/ReportListItem';

export function AuthorityDashboard() {
  const router = useRouter();
  const [session, setSession] = useState<SessionUser | null>(null);
  const [summary, setSummary] = useState<PublicStats | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [wardFilter, setWardFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState<Report | null>(null);
  const [notes, setNotes] = useState('');
  const [expenditure, setExpenditure] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    dashboardApi
      .getSession()
      .then(({ user }) => {
        if (user.authSource === 'cognito') {
          router.push('/admin');
          return;
        }
        setSession(user);
      })
      .catch(() => router.push('/authentication/login?redirect=/admin/reports'))
      .finally(() => setLoading(false));
  }, [router]);

  useEffect(() => {
    if (!session) return;

    dashboardApi
      .getSummary()
      .then(setSummary)
      .catch(() => setMessage('Failed to load dashboard summary.'));

    dashboardApi
      .getReports({ ward: wardFilter || undefined, status: statusFilter || undefined })
      .then(setReports)
      .catch(() => setMessage('Failed to load reports.'));
  }, [session, wardFilter, statusFilter]);

  async function updateStatus(status: ReportStatus) {
    if (!selected) return;

    try {
      const updated = await dashboardApi.updateReport(selected.id, {
        status,
        notes: notes || undefined,
        expenditure: expenditure ? Number(expenditure) : undefined,
      });
      setReports((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
      setSelected(updated);
      setMessage(`Report marked as ${status}. Citizen notified by email if applicable.`);

      const refreshedSummary = await dashboardApi.getSummary();
      setSummary(refreshedSummary);
    } catch (err) {
      setMessage(err instanceof Error ? err.message : 'Update failed.');
    }
  }

  function selectReport(report: Report) {
    setSelected(report);
    setNotes(report.notes ?? '');
    setExpenditure(report.expenditure?.toString() ?? '');
    setMessage('');
  }

  if (loading) return <p>Loading authority dashboard…</p>;
  if (!session) return null;

  const wards = Array.from(new Set(reports.map((r) => r.ward))).sort();

  return (
    <>
      <p className="lead mb-1">
        Signed in as <strong>{session.name}</strong> ({session.type})
        {session.ward !== 'All' && <> · {session.ward}</>}
      </p>
      <p className="text-muted small mb-4">
        Manage ward reports, mark duplicates or cancellations, and resolve issues with expenditure tracking.
      </p>

      {summary && <DashboardSummaryBar summary={summary} />}

      {message && <AlertMessage message={message} variant="info" className="mb-3" />}

      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <select className="form-select" value={wardFilter} onChange={(e) => setWardFilter(e.target.value)}>
            <option value="">All wards</option>
            {wards.map((ward) => (
              <option key={ward} value={ward}>
                {ward}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <select className="form-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All statuses</option>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-7">
          <div className="row g-3">
            {reports.length === 0 ? (
              <div className="col-12">
                <AlertMessage message="No reports match your filters." variant="secondary" />
              </div>
            ) : (
              reports.map((report) => (
                <ReportListItem
                  key={report.id}
                  report={report}
                  selected={selected?.id === report.id}
                  onSelect={selectReport}
                />
              ))
            )}
          </div>
        </div>

        <div className="col-lg-5">
          {selected ? (
            <ReportDetailPanel
              report={selected}
              notes={notes}
              expenditure={expenditure}
              onNotesChange={setNotes}
              onExpenditureChange={setExpenditure}
              onUpdateStatus={updateStatus}
            />
          ) : (
            <div className="card shadow-sm bg-light border-0">
              <div className="card-body text-muted">Select a report to manage.</div>
            </div>
          )}
        </div>
      </div>

    </>
  );
}
