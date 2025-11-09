import { Module } from "@nestjs/common";
import { DiagnosticsModule } from "./diagnostics/diagnostics.module.js";
import { Libp2pModule } from "./libp2p/libp2p.module.js";
import { PeersModule } from "./peers/peers.module.js";

@Module({
  imports: [Libp2pModule, PeersModule, DiagnosticsModule],
})
export class AppModule {}
