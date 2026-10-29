import { NextResponse } from 'next/server';
import { isApiConfigured } from '@/services/api-config';
import { proxyToLambda } from '@/services/lambda-proxy';

const LAMBDA_PATHS: Record<string, string> = {
  register: '/auth/cognito/register',
  'forgot-password': '/auth/cognito/forgot-password',
  'reset-password': '/auth/cognito/reset-password',
  confirm: '/auth/cognito/confirm',
  'resend-confirmation': '/auth/cognito/resend-confirmation',
};

export async function POST(
  request: Request,
  { params }: { params: { action: string } },
) {
  const lambdaPath = LAMBDA_PATHS[params.action];
  if (!lambdaPath) {
    return NextResponse.json({ error: 'Not found.' }, { status: 404 });
  }

  if (!isApiConfigured()) {
    return NextResponse.json({ error: 'Cognito API is not configured.' }, { status: 503 });
  }

  return proxyToLambda(request, lambdaPath);
}
