import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const prismaClientSingleton = () => {
  const connectionString = process.env.DATABASE_URL || 'mysql://root@127.0.0.1:3306/Erpit_db';

  const adapter = new PrismaMariaDb(connectionString);
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
