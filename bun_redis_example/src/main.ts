import dotenv from "dotenv";
import { RedisService } from "./services/redis.service";

// Load environment variables from .env file
dotenv.config();

async function main() {
  console.log("Hello via Bun with Redis!");

  const redis = RedisService.getInstance();

  try {
    await redis.connect();

    // Simple key-value operations
    await redis.set("greeting", "Hello from Redis!");
    const greeting = await redis.get("greeting");
    console.log(`Retrieved value: ${greeting}`);

    // Counter example
    await redis.set("counter", "0");
    await redis.incr("counter");
    await redis.incr("counter");
    const counter = await redis.get("counter");
    console.log(`Counter value: ${counter}`);

    // Hash example
    await redis.hSet("user:1", "name", "John");
    await redis.hSet("user:1", "email", "john@example.com");
    const user = await redis.hGetAll("user:1");
    console.log("User data:", user);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await redis.disconnect();
  }
}

main().catch(console.error);
