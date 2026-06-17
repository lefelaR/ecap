import { AdminPanel } from '../../../components/organisms/AdminPanel';
import { PageTemplate } from '../../../components/templates/PageTemplate';

export default function AdminAuthoritiesPage() {
  return (
    <PageTemplate
      badge="Application Admin"
      badgeClass="bg-success"
      title="Admin Control Panel"
      lead="Register authorities, assign area-limited rights, and preserve data integrity without deletion."
    >
      <AdminPanel />
    </PageTemplate>
  );
}
