import {
  DeleteCommand,
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { DynamoClientFactory } from './DynamoClientFactory';

export abstract class BaseRepository<T extends object> {
  protected readonly client: DynamoDBDocumentClient;

  protected constructor(protected readonly tableName: string) {
    this.client = DynamoClientFactory.getDocumentClient();
  }

  protected async put(item: T): Promise<T> {
    await this.client.send(
      new PutCommand({
        TableName: this.tableName,
        Item: item,
      }),
    );
    return item;
  }

  protected async getByKey<Key extends Record<string, unknown>>(key: Key): Promise<T | null> {
    const result = await this.client.send(
      new GetCommand({
        TableName: this.tableName,
        Key: key,
      }),
    );
    return (result.Item as T | undefined) ?? null;
  }

  protected async scanAll(): Promise<T[]> {
    const items: T[] = [];
    let lastKey: Record<string, unknown> | undefined;

    do {
      const result = await this.client.send(
        new ScanCommand({
          TableName: this.tableName,
          ExclusiveStartKey: lastKey,
        }),
      );
      if (result.Items) {
        items.push(...(result.Items as T[]));
      }
      lastKey = result.LastEvaluatedKey;
    } while (lastKey);

    return items;
  }

  protected async deleteByKey<Key extends Record<string, unknown>>(key: Key): Promise<void> {
    await this.client.send(
      new DeleteCommand({
        TableName: this.tableName,
        Key: key,
      }),
    );
  }
}
