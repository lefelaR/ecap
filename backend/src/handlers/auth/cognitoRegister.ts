import type { APIGatewayProxyEventV2 } from 'aws-lambda';
import { ApiError } from '../../common/ApiError';
import { HandlerFactory } from '../../common/HandlerFactory';
import { HttpResponse } from '../../common/HttpResponse';
import { RequestContext } from '../../common/RequestContext';
import { ServiceContainer } from '../../container/ServiceContainer';

export const handler = HandlerFactory.create(async (event: APIGatewayProxyEventV2) => {
  const ctx = new RequestContext(event);
  const body = await ctx.parseJsonBody<{ email?: string; password?: string; name?: string }>();

  if (!body.email || !body.password || !body.name) {
    throw ApiError.badRequest('Name, email, and password are required.');
  }

  const container = ServiceContainer.getInstance();
  await container.cognitoService.signUp(body.email, body.password, body.name);

  return HttpResponse.created({
    message: 'Account created. Check your email for a verification code, then sign in.',
  });
});
