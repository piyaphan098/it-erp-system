import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import * as mariadb from 'mariadb';

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL || 'mysql://root@127.0.0.1:3306/Erpit_db';

  if (!connectionString.startsWith('mysql://') && !connectionString.startsWith('mariadb://')) {
    return new PrismaClient(); // Fallback if no valid MariaDB string
  }

  const pool = mariadb.createPool(connectionString);
  const adapter = new PrismaMariaDb(pool as any);
  return new PrismaClient({ adapter });
};

declare const globalThis: {
  prismaGlobal?: PrismaClient;
} & typeof global;

// Force fresh instance to load new schemas
if (process.env.NODE_ENV !== 'production' && globalThis.prismaGlobal) {
  globalThis.prismaGlobal.$disconnect().catch(() => {});
  globalThis.prismaGlobal = undefined;
}

export const db = globalThis.prismaGlobal ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = db;
