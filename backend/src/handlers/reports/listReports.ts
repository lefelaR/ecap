import type { APIGatewayProxyEventV2 } from 'aws-lambda';
import { HandlerFactory } from '../../common/HandlerFactory';
import { HttpResponse } from '../../common/HttpResponse';
import { RequestContext } from '../../common/RequestContext';
import { SessionResolver } from '../../common/SessionResolver';
import { ServiceContainer } from '../../container/ServiceContainer';

export const handler = HandlerFactory.create(async (event: APIGatewayProxyEventV2) => {
  const ctx = new RequestContext(event);
  const container = ServiceContainer.getInstance();

  const session = await SessionResolver.resolve(container, ctx);
  const reports = await container.reportService.listReports(session, {
    ward: ctx.query.ward,
    status: ctx.query.status,
  });

  return HttpResponse.ok(reports.map((report) => report.toJSON()));
});
