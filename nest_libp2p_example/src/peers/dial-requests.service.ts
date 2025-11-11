import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import type { Repository } from "typeorm";
import { DialRequestEntity } from "../database/entities/dial-request.entity.js";
import { createContextLogger } from "../logger.js";
import { RedisService } from "../redis/redis.service.js";

type RecordParams = {
  multiaddr: string;
  peerId?: string | null;
  dialTarget: string;
};

type CachedDialRequest = {
  id: number;
  multiaddr: string;
  peerId: string | null;
  dialTarget: string;
  createdAt: string;
  updatedAt: string;
};

const CACHE_PREFIX = "dial_requests:recent";
const DEFAULT_CACHE_TTL = Number.parseInt(
  process.env.POSTGRES_CACHE_TTL_SECONDS ?? "30",
  10,
);

@Injectable()
export class DialRequestsService {
  private readonly logger = createContextLogger(DialRequestsService.name);
  private readonly cacheTtl =
    Number.isFinite(DEFAULT_CACHE_TTL) && DEFAULT_CACHE_TTL > 0
      ? DEFAULT_CACHE_TTL
      : 30;
  private readonly cachedKeys = new Set<string>();

  constructor(
    @InjectRepository(DialRequestEntity)
    private readonly repository: Repository<DialRequestEntity>,
    private readonly redisService: RedisService,
  ) {}

  async recordDialRequest(params: RecordParams): Promise<DialRequestEntity> {
    const entity = this.repository.create({
      multiaddr: params.multiaddr,
      peerId: params.peerId ?? null,
      dialTarget: params.dialTarget,
    });

    const saved = await this.repository.save(entity);
    await this.invalidateCaches();
    return saved;
  }

  async listRecent(limit = 25): Promise<DialRequestEntity[]> {
    const cacheKey = this.buildCacheKey(limit);
    this.cachedKeys.add(cacheKey);
    const cached =
      await this.redisService.getJson<CachedDialRequest[]>(cacheKey);
    if (cached != null) {
      return cached.map((item) => this.deserialize(item));
    }

    const rows = await this.repository.find({
      order: { createdAt: "DESC" },
      take: limit,
    });

    await this.redisService.setJson(
      cacheKey,
      rows.map((row) => this.serialize(row)),
      this.cacheTtl,
    );

    return rows;
  }

  private buildCacheKey(limit: number): string {
    return `${CACHE_PREFIX}:${limit}`;
  }

  private serialize(entity: DialRequestEntity): CachedDialRequest {
    return {
      id: entity.id,
      multiaddr: entity.multiaddr,
      peerId: entity.peerId,
      dialTarget: entity.dialTarget,
      createdAt: entity.createdAt.toISOString(),
      updatedAt: entity.updatedAt.toISOString(),
    };
  }

  private deserialize(payload: CachedDialRequest): DialRequestEntity {
    return this.repository.create({
      id: payload.id,
      multiaddr: payload.multiaddr,
      peerId: payload.peerId,
      dialTarget: payload.dialTarget,
      createdAt: new Date(payload.createdAt),
      updatedAt: new Date(payload.updatedAt),
    });
  }

  private async invalidateCaches(): Promise<void> {
    if (this.cachedKeys.size === 0) {
      return;
    }

    await Promise.all(
      [...this.cachedKeys].map(async (key) => {
        try {
          await this.redisService.deleteKey(key);
        } catch (error) {
          const message =
            error instanceof Error ? error.message : String(error);
          this.logger.warn(
            `Failed to delete Redis cache key ${key}: ${message}`,
          );
        }
      }),
    );
  }
}
