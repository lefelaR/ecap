import { Suspense } from 'react';
import { StatusForm } from './status-form';

export default function StatusPage() {
  return (
    <main className="container py-5">
      <section className="page-banner">
        <span className="badge rounded-pill bg-info text-dark">Status check</span>
        <h1 className="display-6 fw-bold mt-3">Check your issue status</h1>
        <p className="lead">Enter your ECAP reference number to view progress, resolution time, and expenditure.</p>
      </section>

      <Suspense fallback={<p>Loading…</p>}>
        <StatusForm />
      </Suspense>
    </main>
  );
}
