import { Suspense } from 'react';
import { StatusPanel } from '@/components/organisms/StatusPanel';
import { PageTemplate } from '@/components/templates/PageTemplate';

export default function StatusPage() {
  return (
    <PageTemplate
      badge="Status check"
      badgeClass="bg-info text-dark"
      title="Check your issue status"
      lead="Enter your ECAP reference number to view progress, resolution time, and expenditure."
    >
      <Suspense fallback={<p>Loading…</p>}>
        <StatusPanel />
      </Suspense>
    </PageTemplate>
  );
}
