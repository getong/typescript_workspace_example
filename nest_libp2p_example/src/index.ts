import "reflect-metadata";
import "./config/load-env.js";
import { Logger } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.js";

async function bootstrap() {
  const logger = new Logger("Bootstrap");
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.enableShutdownHooks();

  const host = process.env.HTTP_HOST ?? "0.0.0.0";
  const port = Number(process.env.HTTP_PORT ?? process.env.PORT ?? 3000);

  await app.listen(port, host);

  logger.log(`Nest libp2p server listening on http://${host}:${port}`);
}

bootstrap().catch((error) => {
  const logger = new Logger("Bootstrap");
  const message = error instanceof Error ? error.message : String(error);
  logger.error(
    `Failed to start Nest libp2p server: ${message}`,
    error instanceof Error ? error.stack : undefined,
  );
  if (error instanceof Error) {
    console.error(error.stack);
  } else {
    console.error(error);
  }
  process.exit(1);
});
