import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";

const app = await NestFactory.create<NestExpressApplication>(AppModule);

// Enable CORS
app.enableCors();

// Serve static files from the assets directory
app.useStaticAssets(join(process.cwd(), "assets"));

await app.listen(3010);
console.log(`Application is running on: http://localhost:3010`);
console.log(`GraphQL Playground: http://localhost:3010/graphql`);
