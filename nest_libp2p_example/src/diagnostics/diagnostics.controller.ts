import { Controller, Get } from "@nestjs/common";
import { Libp2pService } from "../libp2p/libp2p.service.js";

@Controller("health")
export class DiagnosticsController {
  constructor(private readonly libp2pService: Libp2pService) {}

  @Get()
  getHealth() {
    const summary = this.libp2pService.getSummary();

    return {
      status: summary.status,
      dialTarget: summary.dialTarget ?? null,
      serverReady: summary.server != null,
      clientReady: summary.client != null,
      lastError: summary.lastError ?? null,
    };
  }
}
