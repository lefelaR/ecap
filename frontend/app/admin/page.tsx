import { AuthorityDashboard } from '@/components/organisms/AuthorityDashboard';
import { PageTemplate } from '@/components/templates/PageTemplate';

export default function AdminDashboardPage() {
  return (
    <PageTemplate
      badge="Authority"
      badgeClass="bg-primary"
      title="Site Administration Dashboard"
      lead="Review reports in your jurisdiction, update status, and track expenditure."
    >
      <AuthorityDashboard />
    </PageTemplate>
  );
}
