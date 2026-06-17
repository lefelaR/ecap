import { NextResponse } from 'next/server';
import { readData } from '@/services/store';
import { computeStats } from '@/services/stats';

export async function GET() {
  const data = await readData();
  const publicReports = data.reports.filter((report) => !report.anonymous || report.status === 'Resolved');
  return NextResponse.json(computeStats(publicReports));
}
