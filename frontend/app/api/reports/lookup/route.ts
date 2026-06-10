import { NextResponse } from 'next/server';
import { readData } from '../../../../services/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const reference = searchParams.get('reference')?.trim().toUpperCase();
  const email = searchParams.get('email')?.trim().toLowerCase();

  if (!reference) {
    return NextResponse.json({ error: 'Reference number is required.' }, { status: 400 });
  }

  const data = await readData();
  const report = data.reports.find((entry) => entry.referenceNumber.toUpperCase() === reference);

  if (!report) {
    return NextResponse.json({ error: 'No report found with that reference number.' }, { status: 404 });
  }

  if (report.anonymous) {
    return NextResponse.json({
      referenceNumber: report.referenceNumber,
      status: report.status,
      ward: report.ward,
      category: report.category,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
      resolvedAt: report.resolvedAt,
      expenditure: report.expenditure,
      anonymous: true,
      summary: 'Anonymous crime report',
      description: 'Details withheld for anonymity. Status updates are available by reference only.',
    });
  }

  if (email && report.contactEmail.toLowerCase() !== email) {
    return NextResponse.json({ error: 'Email does not match this reference number.' }, { status: 403 });
  }

  return NextResponse.json({
    referenceNumber: report.referenceNumber,
    status: report.status,
    summary: report.summary,
    description: report.description,
    ward: report.ward,
    category: report.category,
    createdAt: report.createdAt,
    updatedAt: report.updatedAt,
    resolvedAt: report.resolvedAt,
    expenditure: report.expenditure,
    notes: report.notes,
    anonymous: false,
  });
}
