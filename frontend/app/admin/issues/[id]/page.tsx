import { IssueDetailsPanel } from '@/components/organisms/IssueDetailsPanel';
import { AdminPageTemplate } from '@/components/templates/AdminPageTemplate';

type IssueDetailsPageProps = {
  params: { id: string };
};

export default function IssueDetailsPage({ params }: IssueDetailsPageProps) {
  return (
    <AdminPageTemplate
      badge="Issue details"
      badgeClass="bg-primary"
      title="Issue details"
      lead="View the full record for a reported service delivery or crime issue."
    >
      <IssueDetailsPanel reportId={params.id} />
    </AdminPageTemplate>
  );
}
