import type { APIGatewayProxyEventV2 } from 'aws-lambda';
import { HandlerFactory } from '../../common/HandlerFactory';
import { HttpResponse } from '../../common/HttpResponse';
import { RequestContext } from '../../common/RequestContext';
import { Environment } from '../../config/environment';
import { ServiceContainer } from '../../container/ServiceContainer';

export const handler = HandlerFactory.create(async (event: APIGatewayProxyEventV2) => {
  const ctx = new RequestContext(event);
  const container = ServiceContainer.getInstance();

  if (ctx.sessionId) {
    await container.authService.logout(ctx.sessionId);
  }

  return HttpResponse.okWithCookies({ ok: true }, [
    ...HttpResponse.clearCognitoSessionCookies(),
    `${Environment.sessionCookieName}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`,
  ]);
});
