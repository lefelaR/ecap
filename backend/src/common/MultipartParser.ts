import type { APIGatewayProxyEventV2 } from 'aws-lambda';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const parser = require('lambda-multipart-parser') as {
  parse: (event: APIGatewayProxyEventV2) => Promise<Record<string, string | undefined> & { files?: { filename: string }[] }>;
};

export class MultipartParser {
  static async parse(event: APIGatewayProxyEventV2): Promise<{
    fields: Record<string, string>;
    photoNames: string[];
  }> {
    const result = await parser.parse(event);
    const fields: Record<string, string> = {};
    const photoNames: string[] = [];

    for (const [key, value] of Object.entries(result)) {
      if (key === 'files' || !value) continue;
      fields[key] = String(value);
    }

    if (result.files) {
      for (const file of result.files.slice(0, 3)) {
        photoNames.push(file.filename);
      }
    }

    return { fields, photoNames };
  }
}
