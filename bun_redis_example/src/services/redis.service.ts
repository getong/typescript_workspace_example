import { createClient, RedisClientType } from "redis";

export class RedisService {
  private client: RedisClientType;
  private static instance: RedisService;

  private constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || "redis://localhost:6379",
    });

    this.client.on("error", (err) => console.error("Redis Client Error", err));
  }

  public static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  }

  public async connect(): Promise<void> {
    if (!this.client.isOpen) {
      await this.client.connect();
      console.log("Connected to Redis");
    }
  }

  public async disconnect(): Promise<void> {
    if (this.client.isOpen) {
      await this.client.disconnect();
      console.log("Disconnected from Redis");
    }
  }

  public async set(key: string, value: string): Promise<void> {
    await this.client.set(key, value);
  }

  public async get(key: string): Promise<string | null> {
    return await this.client.get(key);
  }

  public async del(key: string): Promise<number> {
    return await this.client.del(key);
  }

  public async incr(key: string): Promise<number> {
    return await this.client.incr(key);
  }

  public async hSet(
    key: string,
    field: string,
    value: string,
  ): Promise<number> {
    return await this.client.hSet(key, field, value);
  }

  public async hGetAll(key: string): Promise<Record<string, string>> {
    return await this.client.hGetAll(key);
  }
}
