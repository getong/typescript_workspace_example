import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";

const app = await NestFactory.create<NestExpressApplication>(AppModule);

// Enable CORS for GraphQL client
app.enableCors();

// Serve React application
app.useStaticAssets(join(__dirname, "..", "react-app-build"));
app.setBaseViewsDir(join(__dirname, "..", "react-app-build"));
app.setViewEngine("html");

// Serve static files (e.g., client.js) from the React build directory
app.useStaticAssets(join(__dirname, "..", "react-app-build", "static"));

// Start the server
const port = 3010;
await app.listen(port);

// Print application URLs
console.log(`Application is running on: http://localhost:${port}`);
console.log(`GraphQL Playground: http://localhost:${port}/graphql`);
console.log(`React application available at: http://localhost:${port}/`);
