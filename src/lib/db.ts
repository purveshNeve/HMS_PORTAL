/**
 * Database client initialization.
 * Replace with Prisma, Drizzle, or your preferred ORM client.
 *
 * @example Prisma
 * import { PrismaClient } from "@prisma/client";
 * const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
 * export const db = globalForPrisma.prisma ?? new PrismaClient();
 */

export interface DatabaseClient {
  query<T>(sql: string, params?: unknown[]): Promise<T[]>;
  disconnect(): Promise<void>;
}

class PlaceholderDatabaseClient implements DatabaseClient {
  async query<T>(_sql: string, _params?: unknown[]): Promise<T[]> {
    return [];
  }

  async disconnect(): Promise<void> {
    return Promise.resolve();
  }
}

const globalForDb = globalThis as unknown as { db: DatabaseClient };

export const db = globalForDb.db ?? new PlaceholderDatabaseClient();

if (process.env.NODE_ENV !== "production") {
  globalForDb.db = db;
}
