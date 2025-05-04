import { Client } from "pg";

export async function initializeDatabase() {
  console.log("Checking if database exists and creating if needed...");

  // Parse the DATABASE_URL to extract database name and connection info
  const dbUrl = new URL(process.env.DATABASE_URL || "");
  const dbName = dbUrl.pathname.replace("/", "");

  // Create a connection string to connect to the PostgreSQL server without specifying a database
  const serverConnectionString = `${dbUrl.protocol}//${dbUrl.username}:${dbUrl.password}@${dbUrl.host}`;

  const client = new Client({
    connectionString: serverConnectionString,
  });

  try {
    await client.connect();
    console.log("Connected to PostgreSQL server");

    // Check if database exists
    const checkDbQuery = `SELECT 1 FROM pg_database WHERE datname = $1`;
    const result = await client.query(checkDbQuery, [dbName]);

    if (result.rowCount === 0) {
      console.log(`Database ${dbName} does not exist. Creating...`);

      // Create the database (cannot use parameters for database names in SQL)
      const createDbQuery = `CREATE DATABASE ${dbName.replace(/[^a-zA-Z0-9_]/g, "_")}`;
      await client.query(createDbQuery);
      console.log(`Database ${dbName} created successfully`);
    } else {
      console.log(`Database ${dbName} already exists`);
    }

    return true;
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  } finally {
    await client.end();
    console.log("Closed connection to PostgreSQL server");
  }
}
