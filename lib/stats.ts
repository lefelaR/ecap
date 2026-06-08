import type { PublicStats, Report } from './types';

export function computeStats(reports: Report[]): PublicStats {
  const resolved = reports.filter((r) => r.status === 'Resolved' && r.resolvedAt);
  const resolutionDays = resolved.map((r) => {
    const start = new Date(r.createdAt).getTime();
    const end = new Date(r.resolvedAt!).getTime();
    return Math.max(1, Math.round((end - start) / (1000 * 60 * 60 * 24)));
  });

  const byCategory: Record<string, number> = {};
  const byWard: Record<string, number> = {};
  const byStatus: Record<string, number> = {};

  for (const report of reports) {
    byCategory[report.category] = (byCategory[report.category] ?? 0) + 1;
    byWard[report.ward] = (byWard[report.ward] ?? 0) + 1;
    byStatus[report.status] = (byStatus[report.status] ?? 0) + 1;
  }

  const openWards = Object.entries(byWard)
    .map(([ward, count]) => ({ ward, count }))
    .filter((entry) => {
      const openInWard = reports.filter((r) => r.ward === entry.ward && (r.status === 'Open' || r.status === 'Under review')).length;
      return openInWard > 0;
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalReports: reports.length,
    openReports: reports.filter((r) => r.status === 'Open' || r.status === 'Under review').length,
    resolvedReports: reports.filter((r) => r.status === 'Resolved').length,
    averageResolutionDays:
      resolutionDays.length > 0 ? Math.round(resolutionDays.reduce((a, b) => a + b, 0) / resolutionDays.length) : 0,
    totalExpenditure: reports.reduce((sum, r) => sum + (r.expenditure ?? 0), 0),
    byCategory,
    byWard,
    byStatus,
    hotspotWards: openWards,
  };
}
