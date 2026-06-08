import { QueryCommand } from '@aws-sdk/lib-dynamodb';
import { Environment } from '../config/environment';
import { ServiceReport } from '../domain/entities/ServiceReport';
import type { ServiceReportRecord } from '../domain/types';
import { BaseRepository } from './BaseRepository';

export class ServiceReportRepository extends BaseRepository<ServiceReportRecord> {
  private static singleton: ServiceReportRepository | null = null;

  constructor() {
    super(Environment.serviceReportsTable);
  }

  static getInstance(): ServiceReportRepository {
    if (!this.singleton) {
      this.singleton = new ServiceReportRepository();
    }
    return this.singleton;
  }

  async save(report: ServiceReport): Promise<ServiceReport> {
    await this.put(report.toJSON());
    return report;
  }

  async findById(id: string): Promise<ServiceReport | null> {
    const record = await this.getByKey({ id });
    return record ? ServiceReport.fromRecord(record) : null;
  }

  async findByReferenceNumber(referenceNumber: string): Promise<ServiceReport | null> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: 'ReferenceNumberIndex',
        KeyConditionExpression: 'referenceNumber = :referenceNumber',
        ExpressionAttributeValues: { ':referenceNumber': referenceNumber },
        Limit: 1,
      }),
    );

    const record = result.Items?.[0] as ServiceReportRecord | undefined;
    if (!record) {
      const fallback = await this.scanAll();
      const match = fallback.find((item) => item.referenceNumber.toUpperCase() === referenceNumber.toUpperCase());
      return match ? ServiceReport.fromRecord(match) : null;
    }

    return ServiceReport.fromRecord(record);
  }

  async findAll(): Promise<ServiceReport[]> {
    const records = await this.scanAll();
    return records
      .map((record) => ServiceReport.fromRecord(record))
      .sort((a, b) => b.toJSON().createdAt.localeCompare(a.toJSON().createdAt));
  }

  async findByWard(ward: string): Promise<ServiceReport[]> {
    const result = await this.client.send(
      new QueryCommand({
        TableName: this.tableName,
        IndexName: 'WardCreatedAtIndex',
        KeyConditionExpression: 'ward = :ward',
        ExpressionAttributeValues: { ':ward': ward },
        ScanIndexForward: false,
      }),
    );

    const records = (result.Items as ServiceReportRecord[] | undefined) ?? [];
    return records.map((record) => ServiceReport.fromRecord(record));
  }

  async getMaxReferenceSequence(): Promise<number> {
    const reports = await this.findAll();
    const year = new Date().getFullYear();

    return reports.reduce((max, report) => {
      const match = report.referenceNumber.match(new RegExp(`ECAP-${year}-(\\d+)`));
      return match ? Math.max(max, Number(match[1])) : max;
    }, 100);
  }
}
