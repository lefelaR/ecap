import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { Environment } from '../config/environment';

export class DynamoClientFactory {
  private static instance: DynamoDBDocumentClient | null = null;

  static getDocumentClient(): DynamoDBDocumentClient {
    if (!this.instance) {
      const client = new DynamoDBClient({ region: Environment.awsRegion });
      this.instance = DynamoDBDocumentClient.from(client, {
        marshallOptions: { removeUndefinedValues: true },
      });
    }
    return this.instance;
  }
}
