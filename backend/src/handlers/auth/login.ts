import type { APIGatewayProxyEventV2 } from 'aws-lambda';
import { ApiError } from '../../common/ApiError';
import { HandlerFactory } from '../../common/HandlerFactory';
import { HttpResponse } from '../../common/HttpResponse';
import { RequestContext } from '../../common/RequestContext';
import { ServiceContainer } from '../../container/ServiceContainer';

export const handler = HandlerFactory.create(async (event: APIGatewayProxyEventV2) => {
  const ctx = new RequestContext(event);
  const body = await ctx.parseJsonBody<{ authorityId?: string }>();

  if (!body.authorityId) {
    throw ApiError.badRequest('Authority ID is required.');
  }

  const container = ServiceContainer.getInstance();
  const { sessionId, user } = await container.authService.login(body.authorityId);

  return HttpResponse.ok(
    {
      authorityId: user.authorityId,
      name: user.name,
      type: user.type,
      ward: user.ward,
      municipality: user.municipality,
    },
    HttpResponse.setSessionCookie(sessionId),
  );
});
