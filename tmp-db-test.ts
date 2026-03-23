import { PrismaClient } from '@prisma/client';
import * as mariadb from 'mariadb';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

async function main() {
  console.log("Connecting to MariaDB/MySQL...");
  const config = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Erpit_db',
    port: 3306,
  };

  const adapter = new PrismaMariaDb(config);
  const prisma = new PrismaClient({ adapter });

  try {
    console.log("Testing findMany on User table...");
    const users = await prisma.user.findMany();
    console.log("Success! Found users:", users.length);
  } catch (error) {
    console.error("Prisma query failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
