import { NestFactory } from "@nestjs/core";
import { UsersModule } from "./users/users.module";

async function bootstrap() {
  const users_modules = await NestFactory.create(UsersModule);
  await users_modules.listen(3000);
}

bootstrap();
