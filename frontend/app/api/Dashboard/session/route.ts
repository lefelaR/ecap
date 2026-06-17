import { NextResponse } from 'next/server';
import { requireDashboardSession } from '../../../../services/dashboard/session';

export async function GET() {
  const result = await requireDashboardSession();
  if ('error' in result) return result.error;
  return NextResponse.json({ user: result.session });
}
