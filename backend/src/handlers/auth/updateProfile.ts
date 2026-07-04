import type { APIGatewayProxyEventV2 } from 'aws-lambda';
import { ApiError } from '../../common/ApiError';
import { HandlerFactory } from '../../common/HandlerFactory';
import { HttpResponse } from '../../common/HttpResponse';
import { RequestContext } from '../../common/RequestContext';
import { SessionResolver } from '../../common/SessionResolver';
import { COGNITO_REFRESH_TOKEN_COOKIE } from '../../config/cognito';
import { ServiceContainer } from '../../container/ServiceContainer';

export const handler = HandlerFactory.create(async (event: APIGatewayProxyEventV2) => {
  const ctx = new RequestContext(event);
  const container = ServiceContainer.getInstance();
  const session = await SessionResolver.resolve(container, ctx);

  if (!session) {
    throw ApiError.unauthorized();
  }

  const body = await ctx.parseJsonBody<{ name?: string; imageUrl?: string }>();
  const name = body.name?.trim();

  if (!name) {
    throw ApiError.badRequest('Name is required.');
  }

  const user = await container.profileService.updateProfile(
    session,
    {
      name,
      ...(body.imageUrl ? { imageUrl: body.imageUrl } : {}),
    },
    ctx.getCookie(COGNITO_REFRESH_TOKEN_COOKIE),
  );

  return HttpResponse.ok({ user });
});
