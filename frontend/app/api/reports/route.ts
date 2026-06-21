import { NextResponse } from 'next/server';
import { canAccessReport, getSession } from '@/services/auth';
import { sendReportConfirmation } from '@/services/email';
import { nextReferenceNumber, readData, writeData } from '@/services/store';
import type { CreateReportInput, Report } from '@/lib/types';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ward = searchParams.get('ward');
  const status = searchParams.get('status');
  const session = await getSession();

  const data = await readData();
  let reports = data.reports;

  if (session) {
    reports = reports.filter((report) => canAccessReport(session, report));
  } else {
    reports = reports.filter((report) => !report.anonymous);
  }

  if (ward) reports = reports.filter((report) => report.ward === ward);
  if (status) reports = reports.filter((report) => report.status === status);

  return NextResponse.json(reports.sort((a, b) => b.createdAt.localeCompare(a.createdAt)));
}

export async function POST(request: Request) {
  const contentType = request.headers.get('content-type') ?? '';
  let payload: CreateReportInput;
  let photoNames: string[] = [];

  if (contentType.includes('multipart/form-data')) {
    const form = await request.formData();
    const files = form.getAll('photos').filter((entry): entry is File => entry instanceof File && entry.size > 0);

    photoNames = files.slice(0, 3).map((file) => file.name);

    payload = {
      type: String(form.get('type') ?? 'service') as CreateReportInput['type'],
      category: String(form.get('category') ?? 'road-engineer') as CreateReportInput['category'],
      location: String(form.get('location') ?? ''),
      address: String(form.get('address') ?? ''),
      lat: Number(form.get('lat') ?? -26.2041),
      lng: Number(form.get('lng') ?? 28.0473),
      summary: String(form.get('summary') ?? ''),
      description: String(form.get('description') ?? ''),
      anonymous: form.get('anonymous') === 'true',
      contactName: String(form.get('contactName') ?? ''),
      contactEmail: String(form.get('contactEmail') ?? ''),
      contactPhone: String(form.get('contactPhone') ?? ''),
      ward: String(form.get('ward') ?? 'Ward 23'),
      municipality: String(form.get('municipality') ?? 'City of Johannesburg'),
      photoNames,
    };
  } else {
    const body = (await request.json()) as CreateReportInput;
    payload = body;
    photoNames = body.photoNames ?? [];
  }

  if (!payload.summary || !payload.description) {
    return NextResponse.json({ error: 'Summary and description are required.' }, { status: 400 });
  }

  if (!payload.anonymous && !payload.contactEmail) {
    return NextResponse.json({ error: 'Contact email is required unless reporting anonymously.' }, { status: 400 });
  }

  const data = await readData();
  const now = new Date().toISOString();
  const newReport: Report = {
    ...payload,
    id: `rep-${Date.now()}`,
    referenceNumber: nextReferenceNumber(data.reports),
    status: 'Open',
    createdAt: now,
    updatedAt: now,
    photoNames,
    contactName: payload.anonymous ? '' : payload.contactName,
    contactEmail: payload.anonymous ? 'anonymous@ecap.local' : payload.contactEmail,
    contactPhone: payload.anonymous ? '' : payload.contactPhone,
  };

  data.reports = [newReport, ...data.reports];
  await writeData(data);
  await sendReportConfirmation(newReport);

  return NextResponse.json(newReport, { status: 201 });
}
