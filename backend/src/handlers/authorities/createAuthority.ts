import type { APIGatewayProxyEventV2 } from 'aws-lambda';
import { ApiError } from '../../common/ApiError';
import { HandlerFactory } from '../../common/HandlerFactory';
import { HttpResponse } from '../../common/HttpResponse';
import { RequestContext } from '../../common/RequestContext';
import { ServiceContainer } from '../../container/ServiceContainer';
import type { CreateAuthorityInput } from '../../domain/types';

export const handler = HandlerFactory.create(async (event: APIGatewayProxyEventV2) => {
  const ctx = new RequestContext(event);
  const container = ServiceContainer.getInstance();
  const session = await container.authService.resolveSession(ctx.sessionId);

  if (!session) {
    throw ApiError.unauthorized();
  }

  const body = await ctx.parseJsonBody<CreateAuthorityInput>();
  const authority = await container.authorityService.registerAuthority(session, body);

  return HttpResponse.created(authority.toJSON());
});
