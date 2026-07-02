import type { APIGatewayProxyEventV2 } from 'aws-lambda';
import { ApiError } from '../../common/ApiError';
import { HandlerFactory } from '../../common/HandlerFactory';
import { HttpResponse } from '../../common/HttpResponse';
import { RequestContext } from '../../common/RequestContext';
import { ServiceContainer } from '../../container/ServiceContainer';

export const handler = HandlerFactory.create(async (event: APIGatewayProxyEventV2) => {
  const ctx = new RequestContext(event);
  const body = await ctx.parseJsonBody<{ email?: string; password?: string }>();

  if (!body.email || !body.password) {
    throw ApiError.badRequest('Email and password are required.');
  }

  const container = ServiceContainer.getInstance();
  const { tokens, user } = await container.cognitoService.signIn(body.email, body.password);

  return HttpResponse.okWithCookies(
    {
      user,
      idToken: tokens.idToken,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    },
    HttpResponse.setCognitoSessionCookies(tokens),
  );
});
