import { NextResponse } from 'next/server';
import { listDashboardReports } from '../../../../services/dashboard/reports';
import { requireDashboardSession } from '../../../../services/dashboard/session';

export async function GET(request: Request) {
  const result = await requireDashboardSession();
  if ('error' in result) return result.error;

  const { searchParams } = new URL(request.url);
  const reports = await listDashboardReports(result.session, {
    ward: searchParams.get('ward'),
    status: searchParams.get('status'),
  });

  return NextResponse.json(reports);
}
