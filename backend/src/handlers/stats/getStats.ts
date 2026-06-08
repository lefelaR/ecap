import type { APIGatewayProxyEventV2 } from 'aws-lambda';
import { HandlerFactory } from '../../common/HandlerFactory';
import { HttpResponse } from '../../common/HttpResponse';
import { ServiceContainer } from '../../container/ServiceContainer';

export const handler = HandlerFactory.create(async (_event: APIGatewayProxyEventV2) => {
  const container = ServiceContainer.getInstance();
  const stats = await container.statisticsService.getPublicStats();
  return HttpResponse.ok(stats);
});
