export type ReportType = 'service' | 'crime';

export interface Report {
  id: string;
  type: ReportType;
  location: string;
  description: string;
  anonymous: boolean;
  ward: string;
  status: 'Open' | 'Under review' | 'Cancelled' | 'Duplicate';
}
