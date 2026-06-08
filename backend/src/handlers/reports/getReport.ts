import type { APIGatewayProxyEventV2 } from 'aws-lambda';
import { HandlerFactory } from '../../common/HandlerFactory';
import { HttpResponse } from '../../common/HttpResponse';
import { RequestContext } from '../../common/RequestContext';
import { ServiceContainer } from '../../container/ServiceContainer';

export const handler = HandlerFactory.create(async (event: APIGatewayProxyEventV2) => {
  const ctx = new RequestContext(event);
  const id = ctx.pathId;

  if (!id) {
    return HttpResponse.json(400, { error: 'Report id is required.' });
  }

  const container = ServiceContainer.getInstance();
  const session = await container.authService.resolveSession(ctx.sessionId);
  const report = await container.reportService.getReport(id, session);

  return HttpResponse.ok(report.toJSON());
});
