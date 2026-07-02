import { proxyToLambda } from '@/services/lambda-proxy';

type RouteContext = { params: { id: string } };

export async function GET(request: Request, { params }: RouteContext) {
  return proxyToLambda(request, `/reports/${params.id}`);
}

export async function PATCH(request: Request, { params }: RouteContext) {
  return proxyToLambda(request, `/reports/${params.id}`);
}
