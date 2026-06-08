import { NextResponse } from 'next/server';
import { readData } from '../../../lib/store';
import { computeStats } from '../../../lib/stats';

export async function GET() {
  const data = await readData();
  const publicReports = data.reports.filter((report) => !report.anonymous || report.status === 'Resolved');
  return NextResponse.json(computeStats(publicReports));
}
