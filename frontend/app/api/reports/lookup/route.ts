import { proxyToLambda } from '@/services/lambda-proxy';

export async function GET(request: Request) {
  return proxyToLambda(request, '/reports/lookup');
}
