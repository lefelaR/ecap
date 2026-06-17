import { NextResponse } from 'next/server';
import { canAccessReport } from '../auth';
import { sendStatusUpdate } from '../email';
import { readData, writeData } from '../store';
import type { Report, ReportStatus, SessionUser } from '../../lib/types';

export function isReportStatus(value: string): value is ReportStatus {
  return ['Open', 'Under review', 'Resolved', 'Cancelled', 'Duplicate'].includes(value);
}

export async function listDashboardReports(
  session: SessionUser,
  filters: { ward?: string | null; status?: string | null },
): Promise<Report[]> {
  const data = await readData();
  let reports = data.reports.filter((report) => canAccessReport(session, report));

  if (filters.ward) reports = reports.filter((report) => report.ward === filters.ward);
  if (filters.status) reports = reports.filter((report) => report.status === filters.status);

  return reports.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export async function updateDashboardReport(
  session: SessionUser,
  id: string,
  body: { status?: ReportStatus; notes?: string; expenditure?: number },
): Promise<{ report: Report } | { error: NextResponse }> {
  if (body.status && !isReportStatus(body.status)) {
    return { error: NextResponse.json({ error: 'Invalid status.' }, { status: 400 }) };
  }

  const data = await readData();
  const index = data.reports.findIndex((entry) => entry.id === id);
  if (index === -1) {
    return { error: NextResponse.json({ error: 'Report not found.' }, { status: 404 }) };
  }

  const report = data.reports[index];
  if (!canAccessReport(session, report)) {
    return { error: NextResponse.json({ error: 'Forbidden.' }, { status: 403 }) };
  }

  const updated = {
    ...report,
    ...body,
    updatedAt: new Date().toISOString(),
    resolvedAt: body.status === 'Resolved' ? new Date().toISOString() : report.resolvedAt,
  };

  data.reports[index] = updated;
  await writeData(data);

  if (body.status && body.status !== report.status) {
    await sendStatusUpdate(updated);
  }

  return { report: updated };
}
