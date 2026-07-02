import type { ServiceReportRecord } from '../domain/types';

export const DEFAULT_ADMIN_EMAIL = 'rakgew@gmail.com';

const DEPARTMENT_EMAIL_DEFAULTS: Record<string, string> = {
  'road-engineer': 'roads@ecap.local',
  'water-services': 'water@ecap.local',
  'waste-management': 'waste@ecap.local',
  'safety-and-security-jmpd': 'jmpd@ecap.local',
  'safety-and-security-saps': 'saps@ecap.local',
};

const CATEGORY_LABELS: Record<ServiceReportRecord['category'], string> = {
  'road-engineer': 'Road Engineer',
  'water-services': 'Water Services',
  'waste-management': 'Waste Management',
  'safety-and-security': 'Safety and Security',
};

const CATEGORY_SERVICE_PROVIDERS: Record<ServiceReportRecord['category'], string> = {
  'road-engineer': 'City of Johannesburg — Roads and Stormwater',
  'water-services': 'Johannesburg Water',
  'waste-management': 'Pikitup',
  'safety-and-security': 'Johannesburg Metropolitan Police Department (JMPD)',
};

export function getAdminNotificationEmail(): string {
  return process.env.ECAP_ADMIN_EMAIL ?? DEFAULT_ADMIN_EMAIL;
}

export function getDepartmentNotificationEmail(report: ServiceReportRecord): string {
  if (report.category === 'safety-and-security') {
    const key = report.type === 'crime' ? 'safety-and-security-saps' : 'safety-and-security-jmpd';
    const envKey = report.type === 'crime' ? 'ECAP_SAPS_EMAIL' : 'ECAP_JMPD_EMAIL';
    return process.env[envKey] ?? DEPARTMENT_EMAIL_DEFAULTS[key];
  }

  const envByCategory: Record<ServiceReportRecord['category'], string | undefined> = {
    'road-engineer': process.env.ECAP_ROADS_EMAIL,
    'water-services': process.env.ECAP_WATER_EMAIL,
    'waste-management': process.env.ECAP_WASTE_EMAIL,
    'safety-and-security': process.env.ECAP_JMPD_EMAIL,
  };

  return envByCategory[report.category] ?? DEPARTMENT_EMAIL_DEFAULTS[report.category];
}

export function canEmailReporter(report: ServiceReportRecord): boolean {
  return !report.anonymous && Boolean(report.contactEmail) && report.contactEmail !== 'anonymous@ecap.local';
}

export function reportDetailLines(report: ServiceReportRecord): string[] {
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

export function reporterContactLines(report: ServiceReportRecord): string[] {
  if (report.anonymous) {
    return ['Reporter: Anonymous (contact details withheld)'];
  }

  return [
    `Reporter: ${report.contactName || 'Not provided'}`,
    `Email: ${report.contactEmail}`,
    report.contactPhone ? `Phone: ${report.contactPhone}` : '',
  ].filter(Boolean);
}

export function getDepartmentLabel(report: ServiceReportRecord): string {
  return CATEGORY_SERVICE_PROVIDERS[report.category];
}
