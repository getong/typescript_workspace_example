import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as dotenv from "dotenv";

async function bootstrap() {
  // Load .env file
  dotenv.config();

  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT || 3000);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
