import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const connectionString = process.env.DATABASE_URL || 'mysql://root@127.0.0.1:3306/Erpit_db';
const adapter = new PrismaMariaDb(connectionString);
const prisma = new PrismaClient({ adapter });

async function main() {
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS \`inventory_item\` (
        \`item_id\` VARCHAR(191) NOT NULL,
        \`item_name\` VARCHAR(191) NOT NULL,
        \`category\` VARCHAR(191) NOT NULL,
        \`brand\` VARCHAR(191),
        \`unit\` VARCHAR(191),
        \`quantity\` INTEGER NOT NULL DEFAULT 0,
        \`min_quantity\` INTEGER NOT NULL DEFAULT 0,
        \`location\` VARCHAR(191),
        \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        \`updatedAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        PRIMARY KEY (\`item_id\`)
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `);

    // We can't ADD Foreign Keys to existing tables if columns haven't been created, but IF EXISTS works for the table.
    // If table already exists this will be ignored.
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS \`inventory_transaction\` (
        \`id\` VARCHAR(191) NOT NULL,
        \`inventoryItemId\` VARCHAR(191) NOT NULL,
        \`type\` VARCHAR(191) NOT NULL,
        \`quantity\` INTEGER NOT NULL,
        \`reason\` VARCHAR(191),
        \`requestedBy\` VARCHAR(191),
        \`relatedAssetId\` VARCHAR(191),
        \`relatedTicketId\` VARCHAR(191),
        \`createdById\` VARCHAR(191) NOT NULL,
        \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        PRIMARY KEY (\`id\`),
        CONSTRAINT \`inventory_transaction_inventoryItemId_fkey\` FOREIGN KEY (\`inventoryItemId\`) REFERENCES \`inventory_item\`(\`item_id\`) ON DELETE RESTRICT ON UPDATE CASCADE,
        CONSTRAINT \`inventory_transaction_createdById_fkey\` FOREIGN KEY (\`createdById\`) REFERENCES \`user\`(\`id\`) ON DELETE RESTRICT ON UPDATE CASCADE
      ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    `);

    // Create Indexes
    await prisma.$executeRawUnsafe(`CREATE INDEX \`inventory_transaction_inventoryItemId_idx\` ON \`inventory_transaction\`(\`inventoryItemId\`);`).catch(() => {});
    await prisma.$executeRawUnsafe(`CREATE INDEX \`inventory_transaction_createdById_idx\` ON \`inventory_transaction\`(\`createdById\`);`).catch(() => {});

    console.log("Successfully created inventory tables.");
  } catch (error) {
    console.error("Error creating tables:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
