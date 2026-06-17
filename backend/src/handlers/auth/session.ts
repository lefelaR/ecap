import type { APIGatewayProxyEventV2 } from 'aws-lambda';
import { HandlerFactory } from '../../common/HandlerFactory';
import { HttpResponse } from '../../common/HttpResponse';
import { RequestContext } from '../../common/RequestContext';
import { ServiceContainer } from '../../container/ServiceContainer';

export const handler = HandlerFactory.create(async (event: APIGatewayProxyEventV2) => {
  const ctx = new RequestContext(event);
  const container = ServiceContainer.getInstance();
  const user =
    (await container.authService.resolveSession(ctx.sessionId)) ??
    (await container.cognitoService.resolveSession(ctx.cognitoIdToken));

  if (!user) {
    return HttpResponse.json(401, { authenticated: false });
  }

  return HttpResponse.ok({ authenticated: true, user });
});
