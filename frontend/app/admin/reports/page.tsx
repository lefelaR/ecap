import { AuthorityDashboard } from '@/components/organisms/AuthorityDashboard';
import { AdminPageTemplate } from '@/components/templates/AdminPageTemplate';

export default function AdminReportsPage() {
  return (
    <AdminPageTemplate
      badge="Authority"
      badgeClass="bg-primary"
      title="Report management"
      lead="Review reports in your jurisdiction, update status, and track expenditure."
    >
      <AuthorityDashboard />
    </AdminPageTemplate>
  );
}
