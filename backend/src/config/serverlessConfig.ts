import { readFileSync } from 'fs';
import { join } from 'path';

const SERVERLESS_YML = join(__dirname, '../../serverless.yml');

/** Reads `custom.deploymentRegion` from serverless.yml (local dev fallback; Lambda sets AWS_REGION automatically). */
export function getDeploymentRegion(): string {
  const content = readFileSync(SERVERLESS_YML, 'utf8');
  const match = content.match(/^\s*deploymentRegion:\s*['"]?([a-z0-9-]+)['"]?\s*$/m);
  if (!match) {
    throw new Error('Missing custom.deploymentRegion in serverless.yml');
  }
  return match[1];
}
