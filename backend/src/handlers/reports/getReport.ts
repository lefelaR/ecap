import type { APIGatewayProxyEventV2 } from 'aws-lambda';
import { HandlerFactory } from '../../common/HandlerFactory';
import { HttpResponse } from '../../common/HttpResponse';
import { RequestContext } from '../../common/RequestContext';
import { SessionResolver } from '../../common/SessionResolver';
import { ServiceContainer } from '../../container/ServiceContainer';

export const handler = HandlerFactory.create(async (event: APIGatewayProxyEventV2) => {
  const ctx = new RequestContext(event);
  const id = ctx.pathId;

  if (!id) {
    return HttpResponse.json(400, { error: 'Report id is required.' });
  }

  const container = ServiceContainer.getInstance();
  const session = await SessionResolver.resolve(container, ctx);
  const report = await container.reportService.getReport(id, session);

  return HttpResponse.ok(report.toJSON());
});
