import { NextResponse } from 'next/server';
import { Report } from '../../../lib/types';

let storedReports: Report[] = [
  {
    id: 'R-100',
    type: 'service',
    location: 'Ward 10, Johannesburg North',
    description: 'Water mains burst near community hall.',
    anonymous: false,
    ward: 'Ward 10',
    status: 'Open',
  },
  {
    id: 'R-101',
    type: 'crime',
    location: 'Ward 3, Soweto',
    description: 'Anonymous crime report for theft incident.',
    anonymous: true,
    ward: 'Ward 3',
    status: 'Under review',
  },
];

export async function GET() {
  return NextResponse.json(storedReports);
}

export async function POST(request: Request) {
  const payload = (await request.json()) as Omit<Report, 'id' | 'status'>;
  const newReport: Report = {
    id: `R-${storedReports.length + 102}`,
    status: 'Open',
    ...payload,
  };

  storedReports = [newReport, ...storedReports];
  return NextResponse.json(newReport, { status: 201 });
}
