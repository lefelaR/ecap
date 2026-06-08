import type { PublicStats, ServiceReportRecord } from '../domain/types';
import { ServiceReportRepository } from '../repositories/ServiceReportRepository';

export class StatisticsService {
  constructor(private readonly reportRepository: ServiceReportRepository) {}

  async getPublicStats(): Promise<PublicStats> {
    const reports = await this.reportRepository.findAll();
    const publicReports = reports
      .map((report) => report.toJSON())
      .filter((report) => !report.anonymous || report.status === 'Resolved');

    return StatisticsService.compute(publicReports);
  }

  static compute(reports: ServiceReportRecord[]): PublicStats {
    const resolved = reports.filter((report) => report.status === 'Resolved' && report.resolvedAt);
    const resolutionDays = resolved.map((report) => {
      const start = new Date(report.createdAt).getTime();
      const end = new Date(report.resolvedAt!).getTime();
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

    const hotspotWards = Object.entries(byWard)
      .map(([ward, count]) => ({ ward, count }))
      .filter((entry) => {
        const openInWard = reports.filter(
          (report) =>
            report.ward === entry.ward &&
            (report.status === 'Open' || report.status === 'Under review'),
        ).length;
        return openInWard > 0;
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalReports: reports.length,
      openReports: reports.filter(
        (report) => report.status === 'Open' || report.status === 'Under review',
      ).length,
      resolvedReports: reports.filter((report) => report.status === 'Resolved').length,
      averageResolutionDays:
        resolutionDays.length > 0
          ? Math.round(resolutionDays.reduce((sum, days) => sum + days, 0) / resolutionDays.length)
          : 0,
      totalExpenditure: reports.reduce((sum, report) => sum + (report.expenditure ?? 0), 0),
      byCategory,
      byWard,
      byStatus,
      hotspotWards,
    };
  }
}
