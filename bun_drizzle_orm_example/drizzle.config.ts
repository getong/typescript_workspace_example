import type { Config } from "drizzle-kit";
import { config } from "dotenv";

// Load environment variables
config();

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.DATABASE_URL || "",
  },
  // Add verbose logging during migration operations
  verbose: true,
  // Specify naming convention for migrations
  strict: true,
} satisfies Config;
