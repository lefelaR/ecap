import { NextResponse } from 'next/server';
import type { Report, ReportStatus } from '@/lib/types';
import { lambdaFetch } from '@/services/lambda-api';

export function isReportStatus(value: string): value is ReportStatus {
  return ['Open', 'Under review', 'Resolved', 'Cancelled', 'Duplicate'].includes(value);
}

export async function listDashboardReports(
  _session: unknown,
  filters: { ward?: string | null; status?: string | null },
): Promise<Report[]> {
  const params = new URLSearchParams();
  if (filters.ward) params.set('ward', filters.ward);
  if (filters.status) params.set('status', filters.status);

  const query = params.toString();
  const response = await lambdaFetch(`/reports${query ? `?${query}` : ''}`);

  if (!response.ok) {
    const body = (await response.json()) as { error?: string };
    throw new Error(body.error ?? 'Failed to load reports.');
  }

  return response.json() as Promise<Report[]>;
}

export async function updateDashboardReport(
  _session: unknown,
  id: string,
  body: { status?: ReportStatus; notes?: string; expenditure?: number },
): Promise<{ report: Report } | { error: NextResponse }> {
  if (body.status && !isReportStatus(body.status)) {
    return { error: NextResponse.json({ error: 'Invalid status.' }, { status: 400 }) };
  }

  const response = await lambdaFetch(`/reports/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const payload = (await response.json()) as Report & { error?: string };

  if (!response.ok) {
    return { error: NextResponse.json({ error: payload.error ?? 'Update failed.' }, { status: response.status }) };
  }

  return { report: payload };
}
