import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Load environment variables (Bun automatically loads .env files)
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set");
}

// Create postgres connection with Bun's built-in fetch options
const connectionString = DATABASE_URL;
const client = postgres(connectionString);

// Create drizzle database instance
export const db = drizzle(client, { schema });
