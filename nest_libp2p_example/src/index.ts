import "reflect-metadata";
import "source-map-support/register.js";
import "./config/load-env.js";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.js";
import { createContextLogger } from "./logger.js";

const bootstrapLogger = createContextLogger("Bootstrap");

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  app.enableShutdownHooks();

  const host = process.env.HTTP_HOST ?? "0.0.0.0";
  const port = Number(process.env.HTTP_PORT ?? process.env.PORT ?? 3000);

  await app.listen(port, host);

  bootstrapLogger.info(
    `Nest libp2p server listening on http://${host}:${port}`,
  );
}

bootstrap().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  if (error instanceof Error) {
    bootstrapLogger.error(`Failed to start Nest libp2p server: ${message}`, {
      stack: error.stack,
    });
  } else {
    bootstrapLogger.error(`Failed to start Nest libp2p server: ${message}`);
  }
  process.exit(1);
});
