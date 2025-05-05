import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { join } from "path";
import * as fs from "fs";

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    const publicPath = join(import.meta.dir, "..", "public");

    // Check if the public directory exists
    if (!fs.existsSync(publicPath)) {
      console.warn(`⚠️ Public directory not found at: ${publicPath}`);
      // Create the directory if it doesn't exist
      fs.mkdirSync(publicPath, { recursive: true });
      console.log(`✓ Created public directory at: ${publicPath}`);
    } else {
      // List files in the public directory
      const files = fs.readdirSync(publicPath);
      console.log(`✓ Public directory found with ${files.length} files:`);
      files.forEach((file) => console.log(`  - ${file}`));
    }

    await app.listen(3000);

    console.log("NestJS application is running on http://localhost:3000");
    console.log("Try visiting:");
    console.log("  - http://localhost:3000");
    console.log("  - http://localhost:3000/about.html");
    console.log("  - http://localhost:3000/about.html/");
  } catch (error) {
    console.error("Failed to start the application:", error);
  }
}

bootstrap();
