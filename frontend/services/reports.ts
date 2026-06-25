import type { Report } from '@/lib/types';
import { HttpService, http } from './http';

function useRemoteApi(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_API_URL?.trim());
}

async function parseReportResponse(response: Response): Promise<Report> {
  const body = (await response.json()) as Report & { error?: string };
  if (!response.ok) {
    throw new Error(body.error ?? 'Failed to submit report.');
  }
  return body;
}

export async function createReport(formData: FormData): Promise<Report> {
  if (useRemoteApi()) {
    const { data } = await http.post<Report>('/reports', formData);
    return data;
  }

  const response = await fetch('/api/reports', {
    method: 'POST',
    body: formData,
    credentials: 'include',
  });

  return parseReportResponse(response);
}

export function getReportErrorMessage(error: unknown, fallback: string): string {
  return HttpService.getErrorMessage(error, fallback);
}
