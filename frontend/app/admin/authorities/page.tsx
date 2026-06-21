import { AdminPanel } from '@/components/organisms/AdminPanel';
import { AdminPageTemplate } from '@/components/templates/AdminPageTemplate';

export default function AdminAuthoritiesPage() {
  return (
    <AdminPageTemplate
      badge="Application Admin"
      badgeClass="bg-success"
      title="Admin Control Panel"
      lead="Register authorities, assign area-limited rights, and preserve data integrity without deletion."
    >
      <AdminPanel />
    </AdminPageTemplate>
  );
}
