import type { APIGatewayProxyEventV2 } from 'aws-lambda';
import { ApiError } from '../../common/ApiError';
import { HandlerFactory } from '../../common/HandlerFactory';
import { HttpResponse } from '../../common/HttpResponse';
import { RequestContext } from '../../common/RequestContext';
import { ServiceContainer } from '../../container/ServiceContainer';

export const handler = HandlerFactory.create(async (event: APIGatewayProxyEventV2) => {
  const ctx = new RequestContext(event);
  const container = ServiceContainer.getInstance();
  const session = await container.authService.resolveSession(ctx.sessionId);

  if (!session) {
    throw ApiError.unauthorized();
  }

  const authorities = await container.authorityService.listAuthorities(session);
  return HttpResponse.ok(authorities.map((authority) => authority.toJSON()));
});
