import { Controller, Get } from "@nestjs/common";
import { Libp2pService } from "../libp2p/libp2p.service.js";
import type {
  Libp2pLifecycleStatus,
  Libp2pSummary,
} from "../libp2p/libp2p.types.js";
import { createContextLogger } from "../logger.js";
import { REDIS_KEYS } from "../redis/redis.constants.js";
import { RedisService } from "../redis/redis.service.js";

type CachedSummaryPayload = {
  summary: Libp2pSummary;
  cachedAt: string;
};

type HealthSnapshot = {
  status: Libp2pLifecycleStatus;
  dialTarget: string | null;
  serverReady: boolean;
  clientReady: boolean;
  lastError: string | null;
};

type HealthCachePayload = {
  health: HealthSnapshot;
  recordedAt: string;
};

@Controller("health")
export class DiagnosticsController {
  private readonly logger = createContextLogger(DiagnosticsController.name);

  constructor(
    private readonly libp2pService: Libp2pService,
    private readonly redisService: RedisService,
  ) {}

  @Get()
  async getHealth() {
    const summary = this.libp2pService.getSummary();
    const snapshot: HealthSnapshot = {
      status: summary.status,
      dialTarget: summary.dialTarget ?? null,
      serverReady: summary.server != null,
      clientReady: summary.client != null,
      lastError: summary.lastError ?? null,
    };

    const previousHealth =
      await this.redisService.getJson<HealthCachePayload>(
        REDIS_KEYS.HEALTH_STATUS,
      );
    await this.persistHealth(snapshot);

    const cachedSummary =
      await this.redisService.getJson<CachedSummaryPayload>(
        REDIS_KEYS.LIBP2P_SUMMARY,
      );

    return {
      ...snapshot,
      cachedSummary: cachedSummary ?? null,
      previousHealth: previousHealth ?? null,
    };
  }

  private async persistHealth(snapshot: HealthSnapshot): Promise<void> {
    try {
      await this.redisService.setJson(
        REDIS_KEYS.HEALTH_STATUS,
        { health: snapshot, recordedAt: new Date().toISOString() },
        30,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.warn(`Failed to store health snapshot: ${message}`);
    }
  }
}
