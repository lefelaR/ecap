import { ProfilePanel } from '@/components/organisms/ProfilePanel';
import { AdminPageTemplate } from '@/components/templates/AdminPageTemplate';

export default function AdminProfilePage() {
  return (
    <AdminPageTemplate
      badge="Profile"
      badgeClass="bg-primary"
      title="Your profile"
      lead="Update your display name and profile photo."
    >
      <ProfilePanel />
    </AdminPageTemplate>
  );
}
