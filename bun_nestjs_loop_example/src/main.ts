import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

const app = await NestFactory.create(AppModule);

await app.listen(3010);
console.log(`Application is running on: ${await app.getUrl()}`);
