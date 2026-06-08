import type { APIGatewayProxyEventV2 } from 'aws-lambda';
import { HandlerFactory } from '../../common/HandlerFactory';
import { HttpResponse } from '../../common/HttpResponse';
import { RequestContext } from '../../common/RequestContext';
import { ServiceContainer } from '../../container/ServiceContainer';

export const handler = HandlerFactory.create(async (event: APIGatewayProxyEventV2) => {
  const ctx = new RequestContext(event);
  const container = ServiceContainer.getInstance();

  const session = await container.authService.resolveSession(ctx.sessionId);
  const reports = await container.reportService.listReports(session, {
    ward: ctx.query.ward,
    status: ctx.query.status,
  });

  return HttpResponse.ok(reports.map((report) => report.toJSON()));
});
