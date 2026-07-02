import { promises as fs } from 'fs';
import path from 'path';
import type { Authority } from '@/lib/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const AUTHORITIES_FILE = path.join(DATA_DIR, 'authorities.json');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');

const SEED_AUTHORITIES: Authority[] = [
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
];

async function ensureAuthoritiesFile(): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.mkdir(UPLOADS_DIR, { recursive: true });

  try {
    await fs.access(AUTHORITIES_FILE);
  } catch {
    await fs.writeFile(AUTHORITIES_FILE, JSON.stringify(SEED_AUTHORITIES, null, 2), 'utf-8');
  }
}

export async function readAuthorities(): Promise<Authority[]> {
  await ensureAuthoritiesFile();
  const raw = await fs.readFile(AUTHORITIES_FILE, 'utf-8');
  return JSON.parse(raw) as Authority[];
}

export async function writeAuthorities(authorities: Authority[]): Promise<void> {
  await ensureAuthoritiesFile();
  await fs.writeFile(AUTHORITIES_FILE, JSON.stringify(authorities, null, 2), 'utf-8');
}

export function uploadsDir(): string {
  return UPLOADS_DIR;
}

export async function getAuthorityById(id: string): Promise<Authority | undefined> {
  const authorities = await readAuthorities();
  return authorities.find((authority) => authority.id === id);
}
