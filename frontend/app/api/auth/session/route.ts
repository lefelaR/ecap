import { NextResponse } from 'next/server';
import { getSession } from '@/services/auth';
import { isApiConfigured } from '@/services/lambda-api';
import { proxyToLambda } from '@/services/lambda-proxy';

export async function GET(request: Request) {
  if (isApiConfigured()) {
    return proxyToLambda(request, '/auth/session');
  }

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
  return NextResponse.json({ authenticated: true, user: session });
}
