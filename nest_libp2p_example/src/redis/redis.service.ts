import { Injectable } from "@nestjs/common";
import type { OnModuleDestroy } from "@nestjs/common";
import { Redis as RedisClient, type RedisOptions } from "ioredis";
import { createContextLogger } from "../logger.js";

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = createContextLogger(RedisService.name);
  private client: RedisClient;
  private usesAuth = false;
  private readonly redisUrl = process.env.REDIS_URL;
  private fallbackAttempted = false;

  constructor() {
    const { client, usesAuth } = this.createClient();
    this.client = client;
    this.usesAuth = usesAuth;
    this.attachLogging(this.client);
  }

  get instance(): RedisClient {
    return this.client;
  }

  async setJson(
    key: string,
    value: unknown,
    ttlSeconds?: number,
  ): Promise<void> {
    const payload = JSON.stringify(value);
    if (ttlSeconds != null && ttlSeconds > 0) {
      await this.client.set(key, payload, "EX", ttlSeconds);
    } else {
      await this.client.set(key, payload);
    }
  }

  async getJson<T>(key: string): Promise<T | null> {
    const payload = await this.client.get(key);
    if (payload == null) {
      return null;
    }

    try {
      return JSON.parse(payload) as T;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.warn(
        `Failed to parse Redis JSON payload for key "${key}": ${message}`,
      );
      return null;
    }
  }

  async deleteKey(key: string): Promise<void> {
    await this.client.del(key);
  }

  async onModuleDestroy(): Promise<void> {
    if (this.client.status === "end") {
      return;
    }

    await this.client.quit();
  }

  private createClient(ignoreAuth = false): {
    client: RedisClient;
    usesAuth: boolean;
  } {
    if (this.redisUrl != null && this.redisUrl.length > 0) {
      return { client: new RedisClient(this.redisUrl), usesAuth: false };
    }

    const host = process.env.REDIS_HOST ?? "127.0.0.1";
    const port = Number(process.env.REDIS_PORT ?? "6379");
    const password =
      process.env.REDIS_PASSWORD && process.env.REDIS_PASSWORD.length > 0
        ? process.env.REDIS_PASSWORD
        : undefined;
    const username =
      process.env.REDIS_USERNAME && process.env.REDIS_USERNAME.length > 0
        ? process.env.REDIS_USERNAME
        : undefined;
    const dbRaw = process.env.REDIS_DB;
    const db = dbRaw != null && dbRaw.length > 0 ? Number(dbRaw) : undefined;

    const options: RedisOptions = {
      host,
      port: Number.isFinite(port) ? port : 6379,
    };

    let usesAuth = false;

    if (!ignoreAuth && password) {
      options.password = password;
      usesAuth = true;
    }

    if (!ignoreAuth && username) {
      options.username = username;
      usesAuth = true;
    }

    if (db != null && Number.isFinite(db)) {
      options.db = db;
    }

    return { client: new RedisClient(options), usesAuth };
  }

  private attachLogging(client: RedisClient): void {
    client.on("connect", () => {
      this.logger.info("Redis connection established");
    });

    client.on("ready", () => {
      this.logger.info("Redis is ready to accept commands");
    });

    client.on("error", (error: unknown) => {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.error(`Redis error: ${message}`, {
        stack: error instanceof Error ? error.stack : undefined,
      });

      if (
        !this.redisUrl &&
        this.usesAuth &&
        !this.fallbackAttempted &&
        typeof message === "string" &&
        message.toUpperCase().includes("WRONGPASS")
      ) {
        this.fallbackAttempted = true;
        this.logger.warn(
          "Redis authentication failed – retrying without username/password",
        );
        void this.replaceClientWithoutAuth();
      }
    });

    client.on("close", () => {
      this.logger.warn("Redis connection closed");
    });
  }

  private async replaceClientWithoutAuth(): Promise<void> {
    const previous = this.client;
    const { client, usesAuth } = this.createClient(true);
    this.client = client;
    this.usesAuth = usesAuth;
    this.attachLogging(client);

    try {
      if (previous.status !== "end") {
        await previous.quit();
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.warn(`Failed to close previous Redis client: ${message}`);
      previous.disconnect();
    }
  }
}
