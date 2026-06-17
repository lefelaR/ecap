import type { PublicStats, SessionUser } from '../../lib/types';
import { computeStats } from '../stats';
import { listDashboardReports } from './reports';

export async function getDashboardSummary(session: SessionUser): Promise<PublicStats> {
  const reports = await listDashboardReports(session, {});
  return computeStats(reports);
}
