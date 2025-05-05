import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe, Logger } from "@nestjs/common";

const logger = new Logger("Bootstrap");

async function bootstrap() {
  try {
    // Create application with enhanced logging and explicit ESM handling
    const app = await NestFactory.create(AppModule, {
      logger: ["error", "warn", "log", "debug", "verbose"],
      // Force proper ESM handling
      autoLoadEntities: true,
      forceCloseConnections: true,
    });

    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        whitelist: true,
      }),
    );

    // Register shutdown hooks for proper cleanup
    app.enableShutdownHooks();

    await app.listen(3010);
    logger.log(`Application is running on: ${await app.getUrl()}`);
  } catch (error) {
    logger.error(`Failed to start application: ${error.message}`, error.stack);
    process.exit(1);
  }
}

bootstrap();
