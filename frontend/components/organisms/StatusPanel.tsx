'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { ReportLookupResult } from '@/lib/types';
import { HttpService, http } from '@/services/http';
import { BackHomeLink } from '../atoms/BackHomeLink';
import { ReportLookupForm } from '../molecules/ReportLookupForm';
import { ReportStatusDetails } from '../molecules/ReportStatusDetails';

export function StatusPanel() {
  const searchParams = useSearchParams();
  const [reference, setReference] = useState('');
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<ReportLookupResult | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function lookup(ref: string, userEmail: string) {
    setLoading(true);
    setError('');
    setResult(null);

    const params = new URLSearchParams({ reference: ref });
    if (userEmail) params.set('email', userEmail);

    try {
      const { data } = await http.get<ReportLookupResult>(`/reports/lookup?${params}`);
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

  return (
    <>
      <div className="row g-4">
        <div className="col-12 col-lg-5">
          <ReportLookupForm
            reference={reference}
            email={email}
            loading={loading}
            error={error}
            onReferenceChange={setReference}
            onEmailChange={setEmail}
            onSubmit={() => lookup(reference.trim(), email.trim())}
          />
        </div>
        <div className="col-12 col-lg-7">
          <ReportStatusDetails result={result} />
        </div>
      </div>

      <div className="mt-4">
        <BackHomeLink />
      </div>
    </>
  );
}
