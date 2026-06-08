'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { CATEGORY_LABELS, STATUS_LABELS } from '../../lib/labels';
import type { Report, ReportStatus, SessionUser } from '../../lib/types';

export default function AuthorityPage() {
  const router = useRouter();
  const [session, setSession] = useState<SessionUser | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [wardFilter, setWardFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState<Report | null>(null);
  const [notes, setNotes] = useState('');
  const [expenditure, setExpenditure] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/auth/session')
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setSession(data.user))
      .catch(() => router.push('/login?redirect=/authority'))
      .finally(() => setLoading(false));
  }, [router]);

  useEffect(() => {
    if (!session) return;

    const params = new URLSearchParams();
    if (wardFilter) params.set('ward', wardFilter);
    if (statusFilter) params.set('status', statusFilter);

    fetch(`/api/reports?${params}`)
      .then((res) => res.json())
      .then(setReports)
      .catch(() => setMessage('Failed to load reports.'));
  }, [session, wardFilter, statusFilter]);

  async function updateStatus(status: ReportStatus) {
    if (!selected) return;

    const response = await fetch(`/api/reports/${selected.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status,
        notes: notes || undefined,
        expenditure: expenditure ? Number(expenditure) : undefined,
      }),
    });

    const updated = await response.json();
    if (!response.ok) {
      setMessage(updated.error ?? 'Update failed.');
      return;
    }

    setReports((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
    setSelected(updated);
    setMessage(`Report marked as ${status}. Citizen notified by email if applicable.`);
  }

  if (loading) {
    return (
      <main className="container py-5">
        <p>Loading authority dashboard…</p>
      </main>
    );
  }

  if (!session) return null;

  const wards = Array.from(new Set(reports.map((r) => r.ward))).sort();

  return (
    <main className="container py-5">
      <section className="page-banner">
        <span className="badge rounded-pill bg-primary">Authority</span>
        <h1 className="display-6 fw-bold mt-3">Authority Dashboard</h1>
        <p className="lead mb-1">
          Signed in as <strong>{session.name}</strong> ({session.type})
          {session.ward !== 'All' && <> · {session.ward}</>}
        </p>
        <p className="text-muted small mb-0">Manage ward reports, mark duplicates or cancellations, and resolve issues with expenditure tracking.</p>
      </section>

      {message && <div className="alert alert-info py-2">{message}</div>}

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
                <div className="alert alert-secondary">No reports match your filters.</div>
              </div>
            ) : (
              reports.map((report) => (
                <div key={report.id} className="col-12">
                  <button
                    type="button"
                    className={`card shadow-sm w-100 text-start border ${selected?.id === report.id ? 'border-primary' : ''}`}
                    onClick={() => {
                      setSelected(report);
                      setNotes(report.notes ?? '');
                      setExpenditure(report.expenditure?.toString() ?? '');
                      setMessage('');
                    }}
                  >
                    <div className="card-body">
                      <div className="d-flex justify-content-between gap-2">
                        <div>
                          <h3 className="h6 mb-1">{report.summary}</h3>
                          <p className="text-muted small mb-0">
                            {report.referenceNumber} · {report.ward}
                            {report.anonymous && ' · Anonymous'}
                          </p>
                        </div>
                        <span className="badge bg-secondary align-self-start">{report.status}</span>
                      </div>
                    </div>
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="col-lg-5">
          {selected ? (
            <div className="card shadow-sm sticky-top" style={{ top: '5rem' }}>
              <div className="card-body">
                <h2 className="h5">{selected.referenceNumber}</h2>
                <p className="text-muted">{CATEGORY_LABELS[selected.category]} · {selected.ward}</p>
                <p>{selected.description}</p>
                {!selected.anonymous && (
                  <p className="small text-muted">
                    Contact: {selected.contactName} · {selected.contactEmail}
                  </p>
                )}

                <div className="mb-3">
                  <label className="form-label" htmlFor="notes">Authority notes</label>
                  <textarea id="notes" className="form-control" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="expenditure">Expenditure (R, when resolving)</label>
                  <input id="expenditure" type="number" className="form-control" value={expenditure} onChange={(e) => setExpenditure(e.target.value)} />
                </div>

                <div className="d-flex flex-wrap gap-2">
                  <button type="button" className="btn btn-sm btn-outline-primary" onClick={() => updateStatus('Under review')}>
                    Under review
                  </button>
                  <button type="button" className="btn btn-sm btn-success" onClick={() => updateStatus('Resolved')}>
                    Resolve
                  </button>
                  <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => updateStatus('Duplicate')}>
                    Mark duplicate
                  </button>
                  <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => updateStatus('Cancelled')}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="card shadow-sm bg-light border-0">
              <div className="card-body text-muted">Select a report to manage.</div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <Link href="/" className="btn btn-secondary">
          Back to home
        </Link>
      </div>
    </main>
  );
}
