import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger } from "@nestjs/common";
import { SeederService } from "./database/seeder.service";

async function initializeDatabase() {
  const logger = new Logger("Database Initialization");

  try {
    logger.log("Creating application context for database initialization...");
    const app = await NestFactory.createApplicationContext(AppModule);

    logger.log("Getting SeederService...");
    const seederService = app.get(SeederService);

    logger.log("Running database seed...");
    await seederService.seed();

    logger.log("Database initialization completed successfully");
    await app.close();
    process.exit(0);
  } catch (error) {
    logger.error("Failed to initialize database", error.stack);
    process.exit(1);
  }
}

// Only run directly when this script is executed directly
if (require.main === module) {
  initializeDatabase();
}
