import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
} from "@nestjs/common";
import { Libp2pService } from "../libp2p/libp2p.service.js";
import type { DialPeerRequest } from "../libp2p/libp2p.types.js";

@Controller("peers")
export class PeersController {
  constructor(private readonly libp2pService: Libp2pService) {}

  @Get()
  getPeers() {
    return this.libp2pService.getSummary();
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
}
