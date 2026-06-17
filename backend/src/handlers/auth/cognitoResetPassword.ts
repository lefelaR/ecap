import type { APIGatewayProxyEventV2 } from 'aws-lambda';
import { ApiError } from '../../common/ApiError';
import { HandlerFactory } from '../../common/HandlerFactory';
import { HttpResponse } from '../../common/HttpResponse';
import { RequestContext } from '../../common/RequestContext';
import { ServiceContainer } from '../../container/ServiceContainer';

export const handler = HandlerFactory.create(async (event: APIGatewayProxyEventV2) => {
  const ctx = new RequestContext(event);
  const body = await ctx.parseJsonBody<{ email?: string; code?: string; password?: string }>();

  if (!body.email || !body.code || !body.password) {
    throw ApiError.badRequest('Email, verification code, and new password are required.');
  }

  const container = ServiceContainer.getInstance();
  await container.cognitoService.resetPassword(body.email, body.code, body.password);

  return HttpResponse.ok({
    message: 'Password updated. You can now sign in with your new password.',
  });
});
