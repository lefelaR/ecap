import type { APIGatewayProxyEventV2 } from 'aws-lambda';
import { ApiError } from '../../common/ApiError';
import { HandlerFactory } from '../../common/HandlerFactory';
import { HttpResponse } from '../../common/HttpResponse';
import { RequestContext } from '../../common/RequestContext';
import { ServiceContainer } from '../../container/ServiceContainer';

export const handler = HandlerFactory.create(async (event: APIGatewayProxyEventV2) => {
  const ctx = new RequestContext(event);
  const body = await ctx.parseJsonBody<{ email?: string }>();

  if (!body.email) {
    throw ApiError.badRequest('Email is required.');
  }

  const container = ServiceContainer.getInstance();
  await container.cognitoService.forgotPassword(body.email);

  return HttpResponse.ok({
    message: 'If an account exists for that email, a reset code has been sent.',
  });
});
