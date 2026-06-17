import { NextResponse } from 'next/server';
import { getDashboardSummary } from '../../../../services/dashboard/summary';
import { requireDashboardSession } from '../../../../services/dashboard/session';

export async function GET() {
  const result = await requireDashboardSession();
  if ('error' in result) return result.error;

  const summary = await getDashboardSummary(result.session);
  return NextResponse.json(summary);
}
