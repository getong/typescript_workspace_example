import { Injectable } from "@nestjs/common";
import type { OnModuleDestroy } from "@nestjs/common";
import type { RedisOptions } from "ioredis";
import Redis from "ioredis";
import { createContextLogger } from "../logger.js";

@Injectable()
export class RedisService implements OnModuleDestroy {
  private readonly logger = createContextLogger(RedisService.name);
  private readonly client: Redis;

  constructor() {
    this.client = this.createClient();
    this.attachLogging();
  }

  get instance(): Redis {
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
      const message =
        error instanceof Error ? error.message : String(error);
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

  private createClient(): Redis {
    const redisUrl = process.env.REDIS_URL;
    if (redisUrl != null && redisUrl.length > 0) {
      return new Redis(redisUrl);
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
    const db =
      dbRaw != null && dbRaw.length > 0 ? Number(dbRaw) : undefined;

    const options: RedisOptions = {
      host,
      port: Number.isFinite(port) ? port : 6379,
    };

    if (password) {
      options.password = password;
    }

    if (username) {
      options.username = username;
    }

    if (db != null && Number.isFinite(db)) {
      options.db = db;
    }

    return new Redis(options);
  }

  private attachLogging(): void {
    this.client.on("connect", () => {
      this.logger.info("Redis connection established");
    });

    this.client.on("ready", () => {
      this.logger.info("Redis is ready to accept commands");
    });

    this.client.on("error", (error: unknown) => {
      const message =
        error instanceof Error ? error.message : String(error);
      this.logger.error(`Redis error: ${message}`, {
        stack: error instanceof Error ? error.stack : undefined,
      });
    });

    this.client.on("close", () => {
      this.logger.warn("Redis connection closed");
    });
  }
}
