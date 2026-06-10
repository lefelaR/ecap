import { ServiceReport } from '../domain/entities/ServiceReport';
import type { CreateReportInput, SessionUser, UpdateReportInput } from '../domain/types';
import { ServiceReportRepository } from '../repositories/ServiceReportRepository';
import { ReferenceNumberGenerator } from '../utils/ReferenceNumberGenerator';
import { EmailNotificationService } from './EmailNotificationService';

export class ReportService {
  constructor(
    private readonly reportRepository: ServiceReportRepository,
    private readonly emailService: EmailNotificationService,
  ) {}

  async listReports(
    session: SessionUser | null,
    filters: { ward?: string; status?: string },
  ): Promise<ServiceReport[]> {
    let reports = await this.reportRepository.findAll();

    reports = reports.filter((report) => {
      if (!session) {
        return !report.toJSON().anonymous;
      }
      return report.canBeViewedBy(session);
    });

    if (filters.ward) {
      reports = reports.filter((report) => report.toJSON().ward === filters.ward);
    }

    if (filters.status) {
      reports = reports.filter((report) => report.toJSON().status === filters.status);
    }

    return reports;
  }

  async createReport(input: CreateReportInput): Promise<ServiceReport> {
    if (!input.summary || !input.description) {
      throw new Error('Summary and description are required.');
    }

    if (!input.anonymous && !input.contactEmail) {
      throw new Error('Contact email is required unless reporting anonymously.');
    }

    const referenceNumber = await ReferenceNumberGenerator.next(() =>
      this.reportRepository.getMaxReferenceSequence(),
    );

    const report = ServiceReport.create(input, referenceNumber);
    await this.reportRepository.save(report);
    await this.emailService.sendConfirmation(report);

    return report;
  }

  async getReport(id: string, session: SessionUser | null): Promise<ServiceReport> {
    const report = await this.findReportByIdOrReference(id);
    if (!report) {
      throw new Error('NOT_FOUND');
    }

    if (session && !report.canBeViewedBy(session)) {
      throw new Error('FORBIDDEN');
    }

    if (!session && report.toJSON().anonymous) {
      throw new Error('NOT_FOUND');
    }

    return report;
  }

  async lookupReport(reference: string, email?: string): Promise<Record<string, unknown>> {
    const report = await this.reportRepository.findByReferenceNumber(reference);
    if (!report) {
      throw new Error('NOT_FOUND');
    }

    try {
      return report.toPublicLookup(email);
    } catch (error) {
      if (error instanceof Error && error.message === 'EMAIL_MISMATCH') {
        throw new Error('EMAIL_MISMATCH');
      }
      throw error;
    }
  }

  async updateReport(id: string, session: SessionUser, input: UpdateReportInput): Promise<ServiceReport> {
    const existing = await this.findReportByIdOrReference(id);
    if (!existing) {
      throw new Error('NOT_FOUND');
    }

    if (!existing.canBeViewedBy(session)) {
      throw new Error('FORBIDDEN');
    }

    const updated = existing.applyUpdate(input);
    await this.reportRepository.save(updated);

    if (input.status && updated.statusChangedFrom(existing)) {
      await this.emailService.sendStatusUpdate(updated);
    }

    return updated;
  }

  private async findReportByIdOrReference(id: string): Promise<ServiceReport | null> {
    const byId = await this.reportRepository.findById(id);
    if (byId) return byId;
    return this.reportRepository.findByReferenceNumber(id);
  }
}
