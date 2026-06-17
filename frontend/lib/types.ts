export type ReportType = 'service' | 'crime';

export type ReportStatus = 'Open' | 'Under review' | 'Resolved' | 'Cancelled' | 'Duplicate';

export type ReportCategory =
  | 'road-engineer'
  | 'water-services'
  | 'waste-management'
  | 'safety-and-security';

export type AuthorityType = 'SAPS' | 'JMPD' | 'Councillor' | 'Urban inspector' | 'Application Admin';

export interface Report {
  id: string;
  referenceNumber: string;
  type: ReportType;
  category: ReportCategory;
  location: string;
  address: string;
  lat: number;
  lng: number;
  summary: string;
  description: string;
  anonymous: boolean;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  ward: string;
  municipality: string;
  status: ReportStatus;
  photoNames: string[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  expenditure?: number;
  notes?: string;
}

export interface Authority {
  id: string;
  name: string;
  email: string;
  type: AuthorityType;
  ward: string;
  municipality: string;
  canViewAnonymousCrime: boolean;
}

export interface EmailLog {
  id: string;
  to: string;
  subject: string;
  body: string;
  reportReference?: string;
  sentAt: string;
}

export interface EcapData {
  reports: Report[];
  authorities: Authority[];
  emails: EmailLog[];
}

export interface PublicStats {
  totalReports: number;
  openReports: number;
  resolvedReports: number;
  averageResolutionDays: number;
  totalExpenditure: number;
  byCategory: Record<string, number>;
  byWard: Record<string, number>;
  byStatus: Record<string, number>;
  hotspotWards: { ward: string; count: number }[];
}

export interface SessionUser {
  authorityId: string;
  name: string;
  type: AuthorityType;
  ward: string;
  municipality: string;
  canViewAnonymousCrime: boolean;
  email?: string;
  authSource?: 'authority' | 'cognito';
}

export type CreateReportInput = Omit<
  Report,
  'id' | 'referenceNumber' | 'status' | 'createdAt' | 'updatedAt' | 'resolvedAt' | 'expenditure' | 'notes'
>;

export interface ReportLookupResult {
  referenceNumber: string;
  status: string;
  summary: string;
  description: string;
  ward: string;
  category: ReportCategory;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  expenditure?: number;
  notes?: string;
  anonymous: boolean;
}
