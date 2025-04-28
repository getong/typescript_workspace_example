import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";
import { Logger } from "@nestjs/common";

const logger = new Logger("Bootstrap");

try {
  logger.log("Starting NestJS application...");
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS
  app.enableCors();

  // Serve static files from the assets directory
  app.useStaticAssets(join(process.cwd(), "assets"));

  await app.listen(3010);
  logger.log(`Application is running on: http://localhost:3010`);
  logger.log(`GraphQL Playground: http://localhost:3010/graphql`);
  logger.log(`GraphQL explore: http://localhost:3010/graphql-client.html`);
} catch (error) {
  logger.error("Error during application bootstrap", error.stack);
  process.exit(1);
}
