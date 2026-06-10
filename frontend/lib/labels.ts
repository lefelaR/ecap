import type { ReportCategory, ReportStatus } from './types';

export const CATEGORY_LABELS: Record<ReportCategory, string> = {
  'road-engineer': 'Road Engineer',
  'water-services': 'Water Services',
  'waste-management': 'Waste Management',
  'safety-and-security': 'Safety and Security',
};

export const STATUS_LABELS: Record<ReportStatus, string> = {
  Open: 'Open',
  'Under review': 'Under review',
  Resolved: 'Resolved',
  Cancelled: 'Cancelled',
  Duplicate: 'Duplicate',
};

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-ZA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
