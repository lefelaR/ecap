import type { PublicStats } from '../../lib/types';
import { StatTile } from '../atoms/StatTile';

interface DashboardSummaryBarProps {
  summary: PublicStats;
}

export function DashboardSummaryBar({ summary }: DashboardSummaryBarProps) {
  return (
    <div className="row g-4 mb-4">
      <StatTile value={summary.totalReports} label="Reports in your scope" />
      <StatTile value={summary.openReports} label="Open / under review" valueClass="text-warning" />
      <StatTile value={summary.resolvedReports} label="Resolved" valueClass="text-success" />
      <StatTile
        value={summary.totalExpenditure > 0 ? `R ${summary.totalExpenditure.toLocaleString()}` : 'R 0'}
        label="Total expenditure"
        valueClass="text-primary"
      />
    </div>
  );
}
