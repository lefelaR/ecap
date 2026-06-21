import type { APIGatewayProxyEventV2 } from 'aws-lambda';
import { ApiError } from '../../common/ApiError';
import { HandlerFactory } from '../../common/HandlerFactory';
import { HttpResponse } from '../../common/HttpResponse';
import { RequestContext } from '../../common/RequestContext';
import { ServiceContainer } from '../../container/ServiceContainer';

export const handler = HandlerFactory.create(async (event: APIGatewayProxyEventV2) => {
  const ctx = new RequestContext(event);
  const body = await ctx.parseJsonBody<{ email?: string; code?: string }>();

  if (!body.email || !body.code) {
    throw ApiError.badRequest('Email and verification code are required.');
  }

  const container = ServiceContainer.getInstance();
  await container.cognitoService.confirmSignUp(body.email, body.code);

  return HttpResponse.ok({
    message: 'Account confirmed. You can now sign in.',
  });
});
