'use client';

import { useEffect, useState } from 'react';
import type { PublicStats } from '@/lib/types';
import { HttpService, http } from '@/services/http';
import { AlertMessage } from '../atoms/AlertMessage';
import { StatTile } from '../atoms/StatTile';
import { CategoryBreakdown } from '../molecules/CategoryBreakdown';
import { ExpenditureSummary } from '../molecules/ExpenditureSummary';
import { HotspotWardsList } from '../molecules/HotspotWardsList';

export function StatisticsPanel() {
  const [stats, setStats] = useState<PublicStats | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    http
      .get<PublicStats>('/stats')
      .then(({ data }) => setStats(data))
      .catch((err) => setError(HttpService.getErrorMessage(err, 'Failed to load statistics.')));
  }, []);

  return (
    <>
      {error && <AlertMessage message={error} className="mb-4" />}

      {stats && (
        <>
          <div className="row g-4 mb-4">
            <StatTile value={stats.totalReports} label="Total reports" />
            <StatTile value={stats.openReports} label="Open / under review" valueClass="text-warning" />
            <StatTile value={stats.resolvedReports} label="Resolved" valueClass="text-success" />
            <StatTile value={stats.averageResolutionDays} label="Avg. days to resolve" valueClass="" />
          </div>

          <div className="row g-4">
            <CategoryBreakdown byCategory={stats.byCategory} />
            <HotspotWardsList hotspotWards={stats.hotspotWards} />
            <ExpenditureSummary totalExpenditure={stats.totalExpenditure} />
          </div>
        </>
      )}
    </>
  );
}
