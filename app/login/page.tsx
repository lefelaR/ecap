import { Suspense } from 'react';
import { LoginForm } from './login-form';

export default function LoginPage() {
  return (
    <main className="container py-5">
      <section className="page-banner text-center">
        <span className="badge rounded-pill bg-primary">Authority login</span>
        <h1 className="display-6 fw-bold mt-3">Sign in to ECAP</h1>
        <p className="lead mx-auto" style={{ maxWidth: 560 }}>
          Select a demo authority account. In production this would use secure municipal credentials.
        </p>
      </section>

      <Suspense fallback={<p className="text-center">Loading…</p>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
