import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { Logger } from "@nestjs/common";
import { NestExpressApplication } from "@nestjs/platform-express";
import path from "node:path";
import { fileURLToPath } from "node:url";

// Get the current directory for ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function bootstrap() {
  const logger = new Logger("Bootstrap");
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Enable CORS
  app.enableCors();

  // Configure static file serving using absolute paths
  const publicPath = path.join(process.cwd(), "public");
  app.useStaticAssets(publicPath);

  await app.listen(3000);
  logger.log("Application is running on: http://localhost:3000");
  logger.log("WebSocket server is running on: ws://localhost:3000");
  logger.log(`Serving static files from: ${publicPath}`);
}

bootstrap().catch((err) => {
  console.error("Failed to start application", err);
});
