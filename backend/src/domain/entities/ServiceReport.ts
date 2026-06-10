import type {
  CreateReportInput,
  ReportStatus,
  ServiceReportRecord,
  SessionUser,
} from '../types';

export class ServiceReport {
  private constructor(private readonly record: ServiceReportRecord) {}

  static fromRecord(record: ServiceReportRecord): ServiceReport {
    return new ServiceReport(record);
  }

  static create(input: CreateReportInput, referenceNumber: string): ServiceReport {
    const now = new Date().toISOString();

    const record: ServiceReportRecord = {
      ...input,
      id: `rep-${Date.now()}`,
      referenceNumber,
      status: 'Open',
      createdAt: now,
      updatedAt: now,
      photoNames: input.photoNames ?? [],
      contactName: input.anonymous ? '' : input.contactName,
      contactEmail: input.anonymous ? 'anonymous@ecap.local' : input.contactEmail,
      contactPhone: input.anonymous ? '' : input.contactPhone,
    };

    return new ServiceReport(record);
  }

  get id(): string {
    return this.record.id;
  }

  get referenceNumber(): string {
    return this.record.referenceNumber;
  }

  get recordData(): ServiceReportRecord {
    return { ...this.record };
  }

  toJSON(): ServiceReportRecord {
    return this.recordData;
  }

  canBeViewedBy(session: SessionUser | null): boolean {
    if (!session) {
      return !this.record.anonymous;
    }

    if (session.type === 'Application Admin') {
      return true;
    }

    if (this.record.type === 'crime') {
      if (this.record.anonymous) {
        return session.canViewAnonymousCrime;
      }
      if (session.ward === 'All') {
        return ['SAPS', 'JMPD', 'Councillor', 'Urban inspector'].includes(session.type);
      }
      return session.ward === this.record.ward;
    }

    if (session.ward === 'All') {
      return true;
    }

    return session.ward === this.record.ward;
  }

  toPublicLookup(email?: string): Record<string, unknown> {
    if (this.record.anonymous) {
      return {
        referenceNumber: this.record.referenceNumber,
        status: this.record.status,
        ward: this.record.ward,
        category: this.record.category,
        createdAt: this.record.createdAt,
        updatedAt: this.record.updatedAt,
        resolvedAt: this.record.resolvedAt,
        expenditure: this.record.expenditure,
        anonymous: true,
        summary: 'Anonymous crime report',
        description:
          'Details withheld for anonymity. Status updates are available by reference only.',
      };
    }

    if (email && this.record.contactEmail.toLowerCase() !== email.toLowerCase()) {
      throw new Error('EMAIL_MISMATCH');
    }

    return {
      referenceNumber: this.record.referenceNumber,
      status: this.record.status,
      summary: this.record.summary,
      description: this.record.description,
      ward: this.record.ward,
      category: this.record.category,
      createdAt: this.record.createdAt,
      updatedAt: this.record.updatedAt,
      resolvedAt: this.record.resolvedAt,
      expenditure: this.record.expenditure,
      notes: this.record.notes,
      anonymous: false,
    };
  }

  applyUpdate(input: { status?: ReportStatus; notes?: string; expenditure?: number }): ServiceReport {
    const now = new Date().toISOString();
    const statusChanged = input.status !== undefined && input.status !== this.record.status;

    return new ServiceReport({
      ...this.record,
      ...input,
      updatedAt: now,
      resolvedAt: input.status === 'Resolved' ? now : this.record.resolvedAt,
      status: input.status ?? this.record.status,
      notes: input.notes ?? this.record.notes,
      expenditure: input.expenditure ?? this.record.expenditure,
      ...(statusChanged ? {} : {}),
    });
  }

  statusChangedFrom(previous: ServiceReport): boolean {
    return previous.record.status !== this.record.status;
  }
}
