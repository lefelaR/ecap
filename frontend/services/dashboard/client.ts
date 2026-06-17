import type { PublicStats, Report, ReportStatus, SessionUser } from '../../lib/types';

async function parseJson<T>(response: Response): Promise<T> {
  const body = (await response.json()) as T & { error?: string };
  if (!response.ok) {
    throw new Error(body.error ?? 'Request failed.');
  }
  return body;
}

export const dashboardApi = {
  async getSession() {
    const response = await fetch('/api/Dashboard/session', { credentials: 'include' });
    return parseJson<{ user: SessionUser }>(response);
  },

  async getReports(filters: { ward?: string; status?: string } = {}) {
    const params = new URLSearchParams();
    if (filters.ward) params.set('ward', filters.ward);
    if (filters.status) params.set('status', filters.status);

    const query = params.toString();
    const response = await fetch(`/api/Dashboard/reports${query ? `?${query}` : ''}`, {
      credentials: 'include',
    });
    return parseJson<Report[]>(response);
  },

  async updateReport(
    id: string,
    payload: { status?: ReportStatus; notes?: string; expenditure?: number },
  ) {
    const response = await fetch(`/api/Dashboard/reports/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    });
    return parseJson<Report>(response);
  },

  async getSummary() {
    const response = await fetch('/api/Dashboard/summary', { credentials: 'include' });
    return parseJson<PublicStats>(response);
  },
};
