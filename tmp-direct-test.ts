import * as mariadb from 'mariadb';

async function main() {
  console.log("Direct MariaDB connection test...");
  try {
    const conn = await mariadb.createConnection("mariadb://root@localhost:3306/Erpit_db");
    console.log("Successfully connected as root!");
    await conn.end();
  } catch (error) {
    console.error("Direct connection failed:", error);
  }
}

main();
