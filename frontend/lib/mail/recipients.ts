import type { Report } from '@/lib/types';

export const DEFAULT_ADMIN_EMAIL = 'rakgew@gmail.com';

const DEPARTMENT_EMAIL_DEFAULTS: Record<string, string> = {
  'road-engineer': 'roads@ecap.local',
  'water-services': 'water@ecap.local',
  'waste-management': 'waste@ecap.local',
  'safety-and-security-jmpd': 'jmpd@ecap.local',
  'safety-and-security-saps': 'saps@ecap.local',
};

export function getAdminNotificationEmail(): string {
  return process.env.ECAP_ADMIN_EMAIL ?? DEFAULT_ADMIN_EMAIL;
}

export function getDepartmentNotificationEmail(report: Report): string {
  if (report.category === 'safety-and-security') {
    const key = report.type === 'crime' ? 'safety-and-security-saps' : 'safety-and-security-jmpd';
    const envKey = report.type === 'crime' ? 'ECAP_SAPS_EMAIL' : 'ECAP_JMPD_EMAIL';
    return process.env[envKey] ?? DEPARTMENT_EMAIL_DEFAULTS[key];
  }

  const envByCategory: Record<Report['category'], string | undefined> = {
    'road-engineer': process.env.ECAP_ROADS_EMAIL,
    'water-services': process.env.ECAP_WATER_EMAIL,
    'waste-management': process.env.ECAP_WASTE_EMAIL,
    'safety-and-security': process.env.ECAP_JMPD_EMAIL,
  };

  return envByCategory[report.category] ?? DEPARTMENT_EMAIL_DEFAULTS[report.category];
}

export function canEmailReporter(report: Report): boolean {
  return !report.anonymous && Boolean(report.contactEmail) && report.contactEmail !== 'anonymous@ecap.local';
}
