import type { APIGatewayProxyEventV2 } from 'aws-lambda';
import { HandlerFactory } from '../../common/HandlerFactory';
import { HttpResponse } from '../../common/HttpResponse';
import { MultipartParser } from '../../common/MultipartParser';
import { RequestContext } from '../../common/RequestContext';
import { ServiceContainer } from '../../container/ServiceContainer';
import type { CreateReportInput } from '../../domain/types';

export const handler = HandlerFactory.create(async (event: APIGatewayProxyEventV2) => {
  const ctx = new RequestContext(event);
  const container = ServiceContainer.getInstance();

  let input: CreateReportInput;

  if (ctx.contentType.includes('multipart/form-data')) {
    const { fields, photoNames } = await MultipartParser.parse(event);
    input = {
      type: (fields.type ?? 'service') as CreateReportInput['type'],
      category: (fields.category ?? 'road-engineer') as CreateReportInput['category'],
      location: fields.location ?? '',
      address: fields.address ?? '',
      lat: Number(fields.lat ?? -26.2041),
      lng: Number(fields.lng ?? 28.0473),
      summary: fields.summary ?? '',
      description: fields.description ?? '',
      anonymous: fields.anonymous === 'true',
      contactName: fields.contactName ?? '',
      contactEmail: fields.contactEmail ?? '',
      contactPhone: fields.contactPhone ?? '',
      ward: fields.ward ?? 'Ward 23',
      municipality: fields.municipality ?? 'City of Johannesburg',
      photoNames,
    };
  } else {
    input = await ctx.parseJsonBody<CreateReportInput>();
  }

  const report = await container.reportService.createReport(input);
  return HttpResponse.created(report.toJSON());
});
