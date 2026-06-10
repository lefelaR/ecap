'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { FormEvent, useEffect, useState } from 'react';
import { CATEGORY_LABELS } from '../../lib/labels';
import { HttpService, http } from '../../services/http';

interface LookupResult {
  referenceNumber: string;
  status: string;
  summary: string;
  description: string;
  ward: string;
  category: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  expenditure?: number;
  notes?: string;
  anonymous: boolean;
}

export function StatusForm() {
  const searchParams = useSearchParams();
  const [reference, setReference] = useState('');
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<LookupResult | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function lookup(ref: string, userEmail: string) {
    setLoading(true);
    setError('');
    setResult(null);

    const params = new URLSearchParams({ reference: ref });
    if (userEmail) params.set('email', userEmail);

    try {
      const { data } = await http.get<LookupResult>(`/reports/lookup?${params}`);
      setResult(data);
    } catch (err) {
      setError(HttpService.getErrorMessage(err, 'Lookup failed.'));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const ref = searchParams.get('reference');
    if (ref) {
      setReference(ref);
      void lookup(ref, '');
    }
  }, [searchParams]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void lookup(reference.trim(), email.trim());
  }

  return (
    <>
      <div className="row g-4">
        <div className="col-12 col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body">
              <form onSubmit={handleSubmit} className="row g-3">
                <div className="col-12">
                  <label className="form-label" htmlFor="reference">Reference number</label>
                  <input
                    id="reference"
                    className="form-control"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="ECAP-2024-00102"
                    required
                  />
                </div>
                <div className="col-12">
                  <label className="form-label" htmlFor="email">Email (optional verification)</label>
                  <input
                    id="email"
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Used to verify non-anonymous reports"
                  />
                </div>
                <div className="col-12">
                  <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                    {loading ? 'Searching…' : 'Look up status'}
                  </button>
                </div>
              </form>
              {error && <div className="alert alert-danger mt-3 mb-0 py-2">{error}</div>}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-7">
          {result ? (
            <div className="card shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h2 className="h5 mb-1">{result.referenceNumber}</h2>
                    <p className="text-muted mb-0">{result.summary}</p>
                  </div>
                  <span className="badge bg-primary">{result.status}</span>
                </div>
                <dl className="row mb-0">
                  <dt className="col-sm-4">Category</dt>
                  <dd className="col-sm-8">{CATEGORY_LABELS[result.category as keyof typeof CATEGORY_LABELS] ?? result.category}</dd>
                  <dt className="col-sm-4">Ward</dt>
                  <dd className="col-sm-8">{result.ward}</dd>
                  <dt className="col-sm-4">Reported</dt>
                  <dd className="col-sm-8">{new Date(result.createdAt).toLocaleString('en-ZA')}</dd>
                  <dt className="col-sm-4">Last updated</dt>
                  <dd className="col-sm-8">{new Date(result.updatedAt).toLocaleString('en-ZA')}</dd>
                  {result.resolvedAt && (
                    <>
                      <dt className="col-sm-4">Resolved</dt>
                      <dd className="col-sm-8">{new Date(result.resolvedAt).toLocaleString('en-ZA')}</dd>
                    </>
                  )}
                  {result.expenditure != null && (
                    <>
                      <dt className="col-sm-4">Expenditure</dt>
                      <dd className="col-sm-8">R {result.expenditure.toLocaleString('en-ZA')}</dd>
                    </>
                  )}
                  <dt className="col-sm-4">Details</dt>
                  <dd className="col-sm-8">{result.description}</dd>
                  {result.notes && (
                    <>
                      <dt className="col-sm-4">Authority notes</dt>
                      <dd className="col-sm-8">{result.notes}</dd>
                    </>
                  )}
                </dl>
              </div>
            </div>
          ) : (
            <div className="card shadow-sm border-0 bg-light">
              <div className="card-body text-muted">Enter a reference number to view report status and resolution details.</div>
            </div>
          )}
        </div>
      </div>

      <div className="mt-4">
        <Link href="/" className="btn btn-outline-secondary">
          Back to home
        </Link>
      </div>
    </>
  );
}
