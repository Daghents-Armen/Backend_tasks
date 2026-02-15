const { Client } = require('pg');

async function checkDatabase() {
  const client = new Client({
    host: 'localhost',
    user: 'postgres',
    password: 'mypassword',
    database: 'postgres',
    port: 5432,
  });

  try {
    await client.connect();

    const result = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = 'ecommerce';`
    );

    if (result.rowCount === 0) {
      console.log("Database does not exist. Creating...");
      await client.query(`CREATE DATABASE ecommerce;`);
      console.log("Database created!");
    } else {
      console.log("Database already exists.");
    }

  } catch (error) {
    console.error("Error checking database:", error);
  } finally {
    await client.end();
  }
}

module.exports = checkDatabase;
