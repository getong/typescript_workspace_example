import * as dotenv from "dotenv";
import { Client } from "pg";

// Load environment variables
dotenv.config();

async function createDatabase() {
  // Connect to default postgres database to create our app database
  const client = new Client({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "5432"),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: "postgres", // Connect to default postgres database
  });

  try {
    await client.connect();
    console.log("Connected to PostgreSQL");

    const dbName = process.env.DB_DATABASE;

    // Check if database exists
    const checkResult = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName],
    );

    // Create database if it doesn't exist
    if (checkResult.rows.length === 0) {
      console.log(`Database "${dbName}" does not exist. Creating...`);
      // Use template0 to avoid encoding issues
      await client.query(`CREATE DATABASE "${dbName}" TEMPLATE template0`);
      console.log(`Database "${dbName}" created successfully!`);
    } else {
      console.log(`Database "${dbName}" already exists.`);
    }
  } catch (error) {
    console.error("Error creating database:", error);
    throw error;
  } finally {
    await client.end();
    console.log("Disconnected from PostgreSQL");
  }
}

// Execute the function if this script is run directly
if (require.main === module) {
  createDatabase()
    .then(() => console.log("Database setup completed"))
    .catch((err) => {
      console.error("Database setup failed:", err);
      process.exit(1);
    });
}

export { createDatabase };
