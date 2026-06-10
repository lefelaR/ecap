import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';

const region = process.env.AWS_REGION ?? 'af-south-1';
const stage = process.env.STAGE ?? 'dev';
const prefix = `ecap-api-${stage}`;

const client = DynamoDBDocumentClient.from(new DynamoDBClient({ region }));

const authorities = [
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

const reports = [
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
];

async function seedTable(tableName: string, items: Record<string, unknown>[]): Promise<void> {
  for (const item of items) {
    await client.send(new PutCommand({ TableName: tableName, Item: item }));
    console.log(`Seeded ${tableName}: ${item.id}`);
  }
}

async function main(): Promise<void> {
  await seedTable(`${prefix}-authorities`, authorities);
  await seedTable(`${prefix}-service-reports`, reports);
  console.log('Seed complete.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
