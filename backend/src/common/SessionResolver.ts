import type { SessionUser } from '../domain/types';
import type { ServiceContainer } from '../container/ServiceContainer';
import type { RequestContext } from './RequestContext';

export class SessionResolver {
  static async resolve(container: ServiceContainer, ctx: RequestContext): Promise<SessionUser | null> {
    return (
      (await container.authService.resolveSession(ctx.sessionId)) ??
      (await container.cognitoService.resolveSession(ctx.cognitoIdToken))
    );
  }
}
