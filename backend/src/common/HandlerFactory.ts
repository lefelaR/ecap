import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from 'aws-lambda';
import { ApiError } from './ApiError';
import { HttpResponse } from './HttpResponse';

export type HandlerLogic = (event: APIGatewayProxyEventV2) => Promise<APIGatewayProxyResultV2>;

export class HandlerFactory {
  static create(logic: HandlerLogic) {
    return async (event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> => {
      try {
        return await logic(event);
      } catch (error) {
        if (error instanceof ApiError) {
          return HttpResponse.json(error.statusCode, { error: error.message });
        }

        if (error instanceof Error) {
          if (['NOT_FOUND', 'FORBIDDEN', 'EMAIL_MISMATCH', 'INVALID_ACCOUNT'].includes(error.message)) {
            const apiError = ApiError.fromCode(error.message);
            return HttpResponse.json(apiError.statusCode, { error: apiError.message });
          }

          console.error(error);
          return HttpResponse.json(400, { error: error.message });
        }

        console.error(error);
        return HttpResponse.json(500, { error: 'Internal server error.' });
      }
    };
  }
}
