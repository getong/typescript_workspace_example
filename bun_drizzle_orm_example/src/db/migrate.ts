import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { initializeDatabase } from "./init";
import * as schema from "./schema";
import { exec } from "child_process";
import { mkdir, writeFile, access } from "fs/promises";
import { join } from "path";

// Helper function to run shell commands
const runCommand = (command: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`Command execution error: ${error.message}`));
        return;
      }
      if (stderr) {
        console.log(`Command stderr: ${stderr}`);
      }
      resolve(stdout);
    });
  });
};

// Function to directly create tables in the database
async function createTablesDirectly() {
  console.log("Creating database tables directly...");

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL environment variable is not set");
  }

  // Use postgres.js with a higher timeout for schema operations
  const migrationClient = postgres(connectionString, {
    max: 1,
    connect_timeout: 30,
    idle_timeout: 30,
  });

  try {
    // Create drizzle instance
    const db = drizzle(migrationClient);

    // Use SQL statements to create tables if they don't exist
    console.log("Creating users table if it doesn't exist...");
    await migrationClient`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;

    console.log("Creating posts table if it doesn't exist...");
    await migrationClient`
      CREATE TABLE IF NOT EXISTS posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT,
        user_id INTEGER REFERENCES users(id),
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `;

    console.log("Tables created successfully");
  } catch (error) {
    console.error("Failed to create tables:", error);
    throw error;
  } finally {
    // Close the connection
    await migrationClient.end();
    console.log("Database connection closed");
  }
}

// Function to run migrations with drizzle-kit push
async function runPush() {
  try {
    console.log("Pushing schema changes to database with drizzle-kit...");
    await runCommand("bunx drizzle-kit push:pg");
    console.log("Schema pushed successfully");
  } catch (error) {
    console.error("Failed to push schema:", error);
    throw error;
  }
}

// Function to run migrations
async function runMigrations() {
  console.log("Starting database migration process...");

  // First make sure the database exists
  await initializeDatabase();

  // Create tables directly with SQL (more reliable than migrations for initial setup)
  await createTablesDirectly();

  console.log("Database schema setup complete");
}

// Run the script if invoked directly
if (require.main === module) {
  runMigrations()
    .then(() => {
      console.log("Migration process completed");
      process.exit(0);
    })
    .catch((err) => {
      console.error("Migration process failed:", err);
      process.exit(1);
    });
}

export { runMigrations };
