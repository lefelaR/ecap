import { NextResponse } from 'next/server';
import { getSession } from '@/services/auth';
import { readData, writeData } from '@/services/store';
import type { Authority, AuthorityType } from '@/lib/types';

export async function GET() {
  const session = await getSession();
  if (!session || session.type !== 'Application Admin') {
    return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  }

  const data = await readData();
  return NextResponse.json(data.authorities);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || session.type !== 'Application Admin') {
    return NextResponse.json({ error: 'Admin access required.' }, { status: 403 });
  }

  const body = (await request.json()) as {
    name: string;
    email: string;
    type: AuthorityType;
    ward: string;
    municipality: string;
  };

  if (!body.name || !body.email || !body.type) {
    return NextResponse.json({ error: 'Name, email, and type are required.' }, { status: 400 });
  }

  const data = await readData();
  const authority: Authority = {
    id: `auth-${Date.now()}`,
    name: body.name,
    email: body.email,
    type: body.type,
    ward: body.ward || 'All',
    municipality: body.municipality || 'City of Johannesburg',
    canViewAnonymousCrime: body.type === 'SAPS' || body.type === 'JMPD' || body.type === 'Application Admin',
  };

  data.authorities = [authority, ...data.authorities];
  await writeData(data);

  return NextResponse.json(authority, { status: 201 });
}
