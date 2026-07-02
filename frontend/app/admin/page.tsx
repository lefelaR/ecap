import { SystemDashboard } from '@/components/organisms/SystemDashboard';
import { AdminPageTemplate } from '@/components/templates/AdminPageTemplate';

export default function AdminDashboardPage() {
  return (
    <AdminPageTemplate
      badge="Dashboard"
      badgeClass="bg-primary"
      title="ECAP system dashboard"
      lead="Your central hub for reporting, status tracking, statistics, and authority workflows."
    >
      <SystemDashboard />
    </AdminPageTemplate>
  );
}
