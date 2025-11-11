import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from "@nestjs/common";
import { Libp2pService } from "../libp2p/libp2p.service.js";
import type {
  DialPeerRequest,
  Libp2pSummary,
} from "../libp2p/libp2p.types.js";
import { createContextLogger } from "../logger.js";
import { REDIS_KEYS } from "../redis/redis.constants.js";
import { RedisService } from "../redis/redis.service.js";

type CachedSummaryPayload = {
  summary: Libp2pSummary;
  cachedAt: string;
};

@Controller("peers")
export class PeersController {
  private readonly logger = createContextLogger(PeersController.name);

  constructor(
    private readonly libp2pService: Libp2pService,
    private readonly redisService: RedisService,
  ) {}

  @Get()
  async getPeers() {
    const summary = this.libp2pService.getSummary();
    await this.cacheSummary(summary);
    return summary;
  }

  @Get("cached")
  async getCachedSummary() {
    const cached = await this.redisService.getJson<CachedSummaryPayload>(
      REDIS_KEYS.LIBP2P_SUMMARY,
    );

    return {
      cachedAt: cached?.cachedAt ?? null,
      summary: cached?.summary ?? null,
    };
  }

  @Post("dial")
  async dialPeer(@Body() body: DialPeerRequest) {
    if (body == null || body.multiaddr == null) {
      throw new BadRequestException("multiaddr is required");
    }

    try {
      return await this.libp2pService.dialPeer(body);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new BadRequestException(message);
    }
  }

  private async cacheSummary(summary: Libp2pSummary): Promise<void> {
    try {
      await this.redisService.setJson(
        REDIS_KEYS.LIBP2P_SUMMARY,
        { summary, cachedAt: new Date().toISOString() },
        30,
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.warn(`Failed to cache libp2p summary: ${message}`);
    }
  }
}
