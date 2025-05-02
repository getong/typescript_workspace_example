import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";
import { LoggingInterceptor } from "./interceptors/logging.interceptor";
import { AuthGuard } from "./guards/auth.guard";

// Simple Logger Middleware
function logger(req, res, next) {
  console.log(`Request... ${req.method} ${req.url}`);
  next();
}

const app = await NestFactory.create(AppModule);

// Apply middleware
app.use(logger);

// Apply global pipe
app.useGlobalPipes(
  new ValidationPipe({
    transform: true,
    whitelist: true,
  }),
);

// Apply global interceptor
app.useGlobalInterceptors(new LoggingInterceptor());

// Apply global guard
app.useGlobalGuards(new AuthGuard());

await app.listen(3010);
console.log(`Application is running on: ${await app.getUrl()}`);
