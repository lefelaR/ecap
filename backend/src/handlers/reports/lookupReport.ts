import type { APIGatewayProxyEventV2 } from 'aws-lambda';
import { ApiError } from '../../common/ApiError';
import { HandlerFactory } from '../../common/HandlerFactory';
import { HttpResponse } from '../../common/HttpResponse';
import { RequestContext } from '../../common/RequestContext';
import { ServiceContainer } from '../../container/ServiceContainer';

export const handler = HandlerFactory.create(async (event: APIGatewayProxyEventV2) => {
  const ctx = new RequestContext(event);
  const reference = ctx.query.reference?.trim();

  if (!reference) {
    throw ApiError.badRequest('Reference number is required.');
  }

  const container = ServiceContainer.getInstance();
  const result = await container.reportService.lookupReport(reference, ctx.query.email?.trim());

  return HttpResponse.ok(result);
});
