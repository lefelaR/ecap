import { NextResponse } from 'next/server';
import { canAccessReport, getSession } from '@/services/auth';
import { sendStatusUpdate } from '@/services/email';
import { readData, writeData } from '@/services/store';
import type { ReportStatus } from '@/lib/types';

type RouteContext = { params: { id: string } };

export async function GET(_request: Request, { params }: RouteContext) {
  const data = await readData();
  const report = data.reports.find((entry) => entry.id === params.id || entry.referenceNumber === params.id);

  if (!report) {
    return NextResponse.json({ error: 'Report not found.' }, { status: 404 });
  }

  const session = await getSession();
  if (session && !canAccessReport(session, report)) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
  }

  if (!session && report.anonymous) {
    return NextResponse.json({ error: 'Report not found.' }, { status: 404 });
  }

  return NextResponse.json(report);
}

export async function PATCH(request: Request, { params }: RouteContext) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Authentication required.' }, { status: 401 });
  }

  const body = (await request.json()) as {
    status?: ReportStatus;
    notes?: string;
    expenditure?: number;
  };

  const data = await readData();
  const index = data.reports.findIndex((entry) => entry.id === params.id);
  if (index === -1) {
    return NextResponse.json({ error: 'Report not found.' }, { status: 404 });
  }

  const report = data.reports[index];
  if (!canAccessReport(session, report)) {
    return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
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

  return NextResponse.json(updated);
}
