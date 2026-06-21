import type { Report } from '@/lib/types';
import { CATEGORY_LABELS, CATEGORY_SERVICE_PROVIDERS } from '@/lib/labels';

export function reporterDisplayName(report: Report): string {
  if (report.anonymous) return 'Anonymous reporter';
  return report.contactName || report.contactEmail || 'Reporter';
}

export function reporterContactLines(report: Report): string[] {
  if (report.anonymous) {
    return ['Reporter: Anonymous (contact details withheld)'];
  }

  return [
    `Reporter: ${report.contactName || 'Not provided'}`,
    `Email: ${report.contactEmail}`,
    report.contactPhone ? `Phone: ${report.contactPhone}` : '',
  ].filter(Boolean);
}

export function reportDetailLines(report: Report): string[] {
  return [
    `Reference: ${report.referenceNumber}`,
    `Type: ${report.type === 'crime' ? 'Crime / safety' : 'Service delivery'}`,
    `Category: ${CATEGORY_LABELS[report.category]}`,
    `Department: ${CATEGORY_SERVICE_PROVIDERS[report.category]}`,
    `Ward: ${report.ward}`,
    `Municipality: ${report.municipality}`,
    `Location: ${report.location}`,
    report.address ? `Address: ${report.address}` : '',
    `Summary: ${report.summary}`,
    `Description: ${report.description}`,
    `Status: ${report.status}`,
  ].filter(Boolean);
}
