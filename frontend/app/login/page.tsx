import { Suspense } from 'react';
import { LoginPanel } from '../../components/organisms/LoginPanel';
import { PageTemplate } from '../../components/templates/PageTemplate';

export default function LoginPage() {
  return (
    <PageTemplate
      badge="Authority login"
      badgeClass="bg-primary"
      title="Sign in to ECAP"
      lead="Select a demo authority account. In production this would use secure municipal credentials."
      centered
    >
      <Suspense fallback={<p className="text-center">Loading…</p>}>
        <LoginPanel />
      </Suspense>
    </PageTemplate>
  );
}
