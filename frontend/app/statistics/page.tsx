import { StatisticsPanel } from '@/components/organisms/StatisticsPanel';
import { BackHomeLink } from '@/components/atoms/BackHomeLink';
import { PageTemplate } from '@/components/templates/PageTemplate';

export default function StatisticsPage() {
  return (
    <PageTemplate
      badge="Public transparency"
      badgeClass="bg-info text-dark"
      title="Service delivery statistics"
      lead="Public view of reported issues, resolution times, expenditure, and hotspot wards."
      footer={
        <div className="mt-4">
          <BackHomeLink />
        </div>
      }
    >
      <StatisticsPanel />
    </PageTemplate>
  );
}
