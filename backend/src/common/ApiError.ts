export class ApiError extends Error {
  constructor(
    message: string,
    readonly statusCode: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static badRequest(message: string): ApiError {
    return new ApiError(message, 400);
  }

  static unauthorized(message = 'Authentication required.'): ApiError {
    return new ApiError(message, 401);
  }

  static forbidden(message = 'Forbidden.'): ApiError {
    return new ApiError(message, 403);
  }

  static notFound(message = 'Resource not found.'): ApiError {
    return new ApiError(message, 404);
  }

  static fromCode(code: string): ApiError {
    switch (code) {
      case 'NOT_FOUND':
        return ApiError.notFound();
      case 'FORBIDDEN':
        return ApiError.forbidden();
      case 'EMAIL_MISMATCH':
        return ApiError.forbidden('Email does not match this reference number.');
      case 'INVALID_ACCOUNT':
        return ApiError.unauthorized('Invalid account.');
      default:
        return ApiError.badRequest(code);
    }
  }
}
