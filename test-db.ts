import { db } from './lib/db';

async function main() {
  try {
    console.log("Testing database connection using lib/db singleton...");
    const userCount = await db.user.count();
    console.log("Success! Total users in database:", userCount);
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  } finally {
    await db.$disconnect();
  }
}

main();
