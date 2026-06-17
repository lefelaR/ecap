import { NextResponse } from 'next/server';
import { updateDashboardReport } from '@/services/dashboard/reports';
import { requireDashboardSession } from '@/services/dashboard/session';
import type { ReportStatus } from '@/lib/types';

type RouteContext = { params: { id: string } };

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
