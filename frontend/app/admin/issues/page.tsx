import { IssuesPanel } from '@/components/organisms/IssuesPanel';
import { AdminPageTemplate } from '@/components/templates/AdminPageTemplate';

export default function AdminIssuesPage() {
  return (
    <AdminPageTemplate
      badge="Issues"
      badgeClass="bg-primary"
      title="Reported issues"
      lead="Browse service delivery and crime reports in your account scope."
    >
      <IssuesPanel />
    </AdminPageTemplate>
  );
}
