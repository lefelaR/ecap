import type { ReportCategory, ReportStatus } from './types';

export const CATEGORY_LABELS: Record<ReportCategory, string> = {
  'road-engineer': 'Road Engineer',
  'water-services': 'Water Services',
  'waste-management': 'Waste Management',
  'safety-and-security': 'Safety and Security',
};

export const CATEGORY_SERVICE_PROVIDERS: Record<ReportCategory, string> = {
  'road-engineer': 'City of Johannesburg — Roads and Stormwater',
  'water-services': 'Johannesburg Water',
  'waste-management': 'Pikitup',
  'safety-and-security': 'Johannesburg Metropolitan Police Department (JMPD)',
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
