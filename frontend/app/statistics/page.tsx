'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CATEGORY_LABELS } from '../../lib/labels';
import type { PublicStats } from '../../lib/types';
import { HttpService, http } from '../../services/http';

export default function StatisticsPage() {
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    http
      .get<PublicStats>('/stats')
      .then(({ data }) => setStats(data))
      .catch((err) => setError(HttpService.getErrorMessage(err, 'Failed to load statistics.')));
  }, []);

  return (
    <main className="container py-5">
      <section className="page-banner">
        <span className="badge rounded-pill bg-info text-dark">Public transparency</span>
        <h1 className="display-6 fw-bold mt-3">Service delivery statistics</h1>
        <p className="lead">Public view of reported issues, resolution times, expenditure, and hotspot wards.</p>
      </section>

      {error && <div className="alert alert-danger">{error}</div>}

      {stats && (
        <>
          <div className="row g-4 mb-4">
            <div className="col-6 col-md-3">
              <div className="card shadow-sm text-center h-100">
                <div className="card-body">
                  <div className="display-6 fw-bold text-primary">{stats.totalReports}</div>
                  <div className="text-muted small">Total reports</div>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card shadow-sm text-center h-100">
                <div className="card-body">
                  <div className="display-6 fw-bold text-warning">{stats.openReports}</div>
                  <div className="text-muted small">Open / under review</div>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card shadow-sm text-center h-100">
                <div className="card-body">
                  <div className="display-6 fw-bold text-success">{stats.resolvedReports}</div>
                  <div className="text-muted small">Resolved</div>
                </div>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="card shadow-sm text-center h-100">
                <div className="card-body">
                  <div className="display-6 fw-bold">{stats.averageResolutionDays}</div>
                  <div className="text-muted small">Avg. days to resolve</div>
                </div>
              </div>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-md-6">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h2 className="h5">By category</h2>
                  <ul className="list-group list-group-flush">
                    {Object.entries(stats.byCategory).map(([key, count]) => (
                      <li key={key} className="list-group-item d-flex justify-content-between px-0">
                        <span>{CATEGORY_LABELS[key as keyof typeof CATEGORY_LABELS] ?? key}</span>
                        <strong>{count}</strong>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h2 className="h5">Hotspot wards</h2>
                  {stats.hotspotWards.length === 0 ? (
                    <p className="text-muted mb-0">No active hotspots.</p>
                  ) : (
                    <ul className="list-group list-group-flush">
                      {stats.hotspotWards.map((entry) => (
                        <li key={entry.ward} className="list-group-item d-flex justify-content-between px-0">
                          <span>{entry.ward}</span>
                          <strong>{entry.count} reports</strong>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>

            <div className="col-12">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h2 className="h5">Total public expenditure on resolved issues</h2>
                  <p className="display-6 fw-bold text-success mb-0">R {stats.totalExpenditure.toLocaleString('en-ZA')}</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="mt-4">
        <Link href="/" className="btn btn-outline-secondary">
          Back to home
        </Link>
      </div>
    </main>
  );
}
