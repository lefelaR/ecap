import type { APIGatewayProxyEventV2 } from 'aws-lambda';
import { ApiError } from '../../common/ApiError';
import { HandlerFactory } from '../../common/HandlerFactory';
import { HttpResponse } from '../../common/HttpResponse';
import { RequestContext } from '../../common/RequestContext';
import { SessionResolver } from '../../common/SessionResolver';
import { ServiceContainer } from '../../container/ServiceContainer';
import type { UpdateReportInput } from '../../domain/types';

export const handler = HandlerFactory.create(async (event: APIGatewayProxyEventV2) => {
  const ctx = new RequestContext(event);
  const id = ctx.pathId;

  if (!id) {
    return HttpResponse.json(400, { error: 'Report id is required.' });
  }

  const container = ServiceContainer.getInstance();
  const session = await SessionResolver.resolve(container, ctx);

  if (!session) {
    throw ApiError.unauthorized();
  }

  const body = await ctx.parseJsonBody<UpdateReportInput>();
  const report = await container.reportService.updateReport(id, session, body);

  return HttpResponse.ok(report.toJSON());
});
