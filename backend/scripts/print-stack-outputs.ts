import { CloudFormationClient, DescribeStacksCommand } from '@aws-sdk/client-cloudformation';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { getDeploymentRegion } from '../src/config/serverlessConfig';

const SERVICE_NAME = 'ecap-api';

const BACKEND_ENV_BY_OUTPUT_KEY: Record<string, string> = {
  ServiceReportsTableName: 'SERVICE_REPORTS_TABLE',
  AuthoritiesTableName: 'AUTHORITIES_TABLE',
  EmailNotificationsTableName: 'EMAIL_NOTIFICATIONS_TABLE',
  UserSessionsTableName: 'USER_SESSIONS_TABLE',
  ReportPhotosBucketName: 'REPORT_PHOTOS_BUCKET',
};

const FRONTEND_ENV_BY_OUTPUT_KEY: Record<string, string> = {
  CognitoUserPoolId: 'NEXT_PUBLIC_COGNITO_USER_POOL_ID',
  CognitoUserPoolClientId: 'NEXT_PUBLIC_COGNITO_CLIENT_ID',
  ReportPhotosBucketName: 'NEXT_PUBLIC_REPORT_PHOTOS_BUCKET',
};

function parseStage(): string {
  const stageIndex = process.argv.indexOf('--stage');
  if (stageIndex !== -1 && process.argv[stageIndex + 1]) {
    return process.argv[stageIndex + 1];
  }
  return process.env.STAGE ?? 'dev';
}

function updateEnvFile(filePath: string, updates: Record<string, string>): void {
  const lines = existsSync(filePath) ? readFileSync(filePath, 'utf8').split('\n') : [];
  const seen = new Set<string>();
  const nextLines: string[] = [];

  for (const line of lines) {
    const match = line.match(/^([A-Z0-9_]+)=/);
    if (match && updates[match[1]]) {
      nextLines.push(`${match[1]}=${updates[match[1]]}`);
      seen.add(match[1]);
      continue;
    }
    nextLines.push(line);
  }

  for (const [key, value] of Object.entries(updates)) {
    if (!seen.has(key)) {
      if (nextLines.length > 0 && nextLines[nextLines.length - 1] !== '') {
        nextLines.push('');
      }
      nextLines.push(`${key}=${value}`);
    }
  }

  writeFileSync(filePath, `${nextLines.join('\n').replace(/\n+$/, '')}\n`);
}

async function main(): Promise<void> {
  const stage = parseStage();
  const region = process.env.AWS_REGION ?? process.env.AWS_DEFAULT_REGION ?? getDeploymentRegion();
  const stackName = `${SERVICE_NAME}-${stage}`;
  const client = new CloudFormationClient({ region });

  let outputs: { OutputKey?: string; OutputValue?: string }[];

  try {
    const response = await client.send(new DescribeStacksCommand({ StackName: stackName }));
    outputs = response.Stacks?.[0]?.Outputs ?? [];
  } catch (error) {
    console.log('\nStack outputs unavailable (stack not deployed or AWS credentials missing).\n');
    if (error instanceof Error) {
      console.log(`  ${error.message}\n`);
    }
    return;
  }

  if (outputs.length === 0) {
    console.log('\nNo stack outputs found.\n');
    return;
  }

  const byKey = new Map(outputs.map((output) => [output.OutputKey ?? '', output.OutputValue ?? '']));

  console.log('\nStack outputs (backend .env):\n');

  const backendEnvUpdates: Record<string, string> = { STAGE: stage };
  for (const [outputKey, envVar] of Object.entries(BACKEND_ENV_BY_OUTPUT_KEY)) {
    const value = byKey.get(outputKey);
    if (value) {
      console.log(`  ${envVar}=${value}`);
      backendEnvUpdates[envVar] = value;
    }
  }

  const frontendEnvUpdates: Record<string, string> = {
    NEXT_PUBLIC_AWS_REGION: region,
    NEXT_PUBLIC_COGNITO_REGION: region,
  };

  console.log('\nCognito (frontend .env):\n');

  for (const [outputKey, envVar] of Object.entries(FRONTEND_ENV_BY_OUTPUT_KEY)) {
    const value = byKey.get(outputKey);
    if (value) {
      console.log(`  ${envVar}=${value}`);
      frontendEnvUpdates[envVar] = value;
    }
  }

  console.log(`  NEXT_PUBLIC_COGNITO_REGION=${region}`);
  console.log(`  NEXT_PUBLIC_AWS_REGION=${region}`);

  const backendEnvPath = join(__dirname, '../.env');
  const frontendEnvPath = join(__dirname, '../../frontend/.env');

  updateEnvFile(backendEnvPath, backendEnvUpdates);
  updateEnvFile(frontendEnvPath, frontendEnvUpdates);

  console.log(`\nUpdated ${backendEnvPath}`);
  console.log(`Updated ${frontendEnvPath}\n`);
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
