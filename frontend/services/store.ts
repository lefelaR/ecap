import { promises as fs } from 'fs';
import path from 'path';
import type { Authority, EcapData, Report } from '../lib/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'ecap.json');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');

const SEED: EcapData = {
  reports: [
    {
      id: 'rep-100',
      referenceNumber: 'ECAP-2024-00100',
      type: 'service',
      category: 'water-services',
      location: 'Ward 10, Johannesburg North',
      address: 'Community Hall, Main Rd',
      lat: -26.12,
      lng: 28.04,
      summary: 'Water mains burst near community hall',
      description: 'Water mains burst near community hall. Flooding on pavement.',
      anonymous: false,
      contactName: 'Thabo M.',
      contactEmail: 'thabo@example.com',
      contactPhone: '0820000001',
      ward: 'Ward 10',
      municipality: 'City of Johannesburg',
      status: 'Open',
      photoNames: [],
      createdAt: '2024-05-10T08:00:00.000Z',
      updatedAt: '2024-05-10T08:00:00.000Z',
    },
    {
      id: 'rep-101',
      referenceNumber: 'ECAP-2024-00101',
      type: 'crime',
      category: 'safety-and-security',
      location: 'Ward 3, Soweto',
      address: 'Corner Vilakazi St',
      lat: -26.24,
      lng: 27.91,
      summary: 'Theft incident reported',
      description: 'Anonymous crime report for theft incident at local shop.',
      anonymous: true,
      contactName: '',
      contactEmail: 'anonymous@ecap.local',
      contactPhone: '',
      ward: 'Ward 3',
      municipality: 'City of Johannesburg',
      status: 'Under review',
      photoNames: [],
      createdAt: '2024-05-12T14:30:00.000Z',
      updatedAt: '2024-05-13T09:00:00.000Z',
    },
    {
      id: 'rep-102',
      referenceNumber: 'ECAP-2024-00102',
      type: 'service',
      category: 'road-engineer',
      location: 'Ward 23, Wynberg',
      address: 'Example St near post box',
      lat: -26.14,
      lng: 28.01,
      summary: 'Large pothole on Example St',
      description: '10 inch pothole causing vehicle damage. Present for two months.',
      anonymous: false,
      contactName: 'Lerato K.',
      contactEmail: 'lerato@example.com',
      contactPhone: '0820000002',
      ward: 'Ward 23',
      municipality: 'City of Johannesburg',
      status: 'Resolved',
      photoNames: [],
      createdAt: '2024-04-01T10:00:00.000Z',
      updatedAt: '2024-04-15T16:00:00.000Z',
      resolvedAt: '2024-04-15T16:00:00.000Z',
      expenditure: 12500,
    },
  ],
  authorities: [
    {
      id: 'auth-admin',
      name: 'System Administrator',
      email: 'admin@ecap.local',
      type: 'Application Admin',
      ward: 'All',
      municipality: 'National',
      canViewAnonymousCrime: true,
    },
    {
      id: 'auth-councillor-23',
      name: 'Councillor Nkosi',
      email: 'councillor.ward23@ecap.local',
      type: 'Councillor',
      ward: 'Ward 23',
      municipality: 'City of Johannesburg',
      canViewAnonymousCrime: false,
    },
    {
      id: 'auth-saps',
      name: 'SAPS Officer Molefe',
      email: 'saps@ecap.local',
      type: 'SAPS',
      ward: 'All',
      municipality: 'City of Johannesburg',
      canViewAnonymousCrime: true,
    },
    {
      id: 'auth-jmpd',
      name: 'JMPD Inspector Dlamini',
      email: 'jmpd@ecap.local',
      type: 'JMPD',
      ward: 'All',
      municipality: 'City of Johannesburg',
      canViewAnonymousCrime: true,
    },
  ],
  emails: [],
};

async function ensureDataFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(UPLOADS_DIR, { recursive: true });

  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, JSON.stringify(SEED, null, 2), 'utf-8');
  }
}

export async function readData(): Promise<EcapData> {
  await ensureDataFile();
  const raw = await fs.readFile(DATA_FILE, 'utf-8');
  return JSON.parse(raw) as EcapData;
}

export async function writeData(data: EcapData): Promise<void> {
  await ensureDataFile();
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export function nextReferenceNumber(reports: Report[]): string {
  const year = new Date().getFullYear();
  const max = reports.reduce((acc, report) => {
    const match = report.referenceNumber.match(/ECAP-\d{4}-(\d+)/);
    return match ? Math.max(acc, Number(match[1])) : acc;
  }, 100);
  return `ECAP-${year}-${String(max + 1).padStart(5, '0')}`;
}

export function uploadsDir(): string {
  return UPLOADS_DIR;
}

export async function getAuthorityById(id: string): Promise<Authority | undefined> {
  const data = await readData();
  return data.authorities.find((authority) => authority.id === id);
}
