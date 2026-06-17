export const cognitoConfig = {
  userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID ?? '',
  clientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID ?? '',
  region: process.env.NEXT_PUBLIC_COGNITO_REGION ?? 'eu-central-1',
};

export function isCognitoConfigured(): boolean {
  return Boolean(cognitoConfig.userPoolId && cognitoConfig.clientId);
}

export function mapCognitoError(error: unknown): string {
  const code = (error as { code?: string; name?: string }).code ?? (error as { name?: string }).name;

  switch (code) {
    case 'UserNotFoundException':
      return 'No account found with that email address.';
    case 'NotAuthorizedException':
      return 'Incorrect email or password.';
    case 'UserNotConfirmedException':
      return 'Your account is not confirmed yet. Check your email for a verification link.';
    case 'UsernameExistsException':
      return 'An account with this email already exists.';
    case 'InvalidPasswordException':
      return 'Password does not meet the requirements.';
    case 'CodeMismatchException':
      return 'Invalid verification code. Please try again.';
    case 'ExpiredCodeException':
      return 'Verification code has expired. Request a new one.';
    case 'LimitExceededException':
      return 'Too many attempts. Please wait and try again.';
    case 'InvalidParameterException':
      return 'One or more fields are invalid.';
    default:
      return error instanceof Error ? error.message : 'Something went wrong. Please try again.';
  }
}
