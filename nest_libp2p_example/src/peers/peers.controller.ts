import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from "@nestjs/common";
import { Libp2pService } from "../libp2p/libp2p.service.js";
import type { DialPeerRequest, Libp2pSummary } from "../libp2p/libp2p.types.js";
import { createContextLogger } from "../logger.js";
import { REDIS_KEYS } from "../redis/redis.constants.js";
import { RedisService } from "../redis/redis.service.js";
import { DialRequestsService } from "./dial-requests.service.js";

type CachedSummaryPayload = {
  summary: Libp2pSummary;
  cachedAt: string;
};

type DialHistoryItem = {
  id: number;
  multiaddr: string;
  peerId: string | null;
  dialTarget: string;
  createdAt: string;
  updatedAt: string;
};

@Controller("peers")
export class PeersController {
  private readonly logger = createContextLogger(PeersController.name);

  constructor(
    private readonly libp2pService: Libp2pService,
    private readonly redisService: RedisService,
    private readonly dialRequestsService: DialRequestsService,
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
      const result = await this.libp2pService.dialPeer(body);
      await this.recordDialHistory(result.dialTarget, body);
      return result;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      throw new BadRequestException(message);
    }
  }

  @Get("dials")
  async getDialHistory(): Promise<DialHistoryItem[]> {
    const items = await this.dialRequestsService.listRecent();
    return items.map((item) => ({
      id: item.id,
      multiaddr: item.multiaddr,
      peerId: item.peerId,
      dialTarget: item.dialTarget,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    }));
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

  private async recordDialHistory(
    dialTarget: string,
    body: DialPeerRequest,
  ): Promise<void> {
    try {
      await this.dialRequestsService.recordDialRequest({
        multiaddr: body.multiaddr,
        peerId: body.peerId ?? null,
        dialTarget,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.warn(`Failed to persist dial history: ${message}`);
    }
  }
}
