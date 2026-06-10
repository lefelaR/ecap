import { AuthorityDashboard } from '../../components/organisms/AuthorityDashboard';
import { PageTemplate } from '../../components/templates/PageTemplate';

export default function AuthorityPage() {
  return (
    <PageTemplate badge="Authority" badgeClass="bg-primary" title="Authority Dashboard">
      <AuthorityDashboard />
    </PageTemplate>
  );
}
