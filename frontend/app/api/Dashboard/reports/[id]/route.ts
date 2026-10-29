import { NextResponse } from 'next/server';
import { getDashboardReport, updateDashboardReport } from '@/services/dashboard/reports';
import { requireDashboardSession } from '@/services/dashboard/session';
import type { ReportStatus } from '@/lib/types';

type RouteContext = { params: { id: string } };

export async function GET(_request: Request, { params }: RouteContext) {
  const result = await requireDashboardSession();
  if ('error' in result) return result.error;

  try {
    const report = await getDashboardReport(params.id);
    if (!report) {
      return NextResponse.json({ error: 'Report not found.' }, { status: 404 });
    }
    return NextResponse.json(report);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load report.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const result = await requireDashboardSession();
  if ('error' in result) return result.error;

  const body = (await request.json()) as {
    status?: ReportStatus;
    notes?: string;
    expenditure?: number;
  };

  const update = await updateDashboardReport(result.session, params.id, body);
  if ('error' in update) return update.error;

  return NextResponse.json(update.report);
}
