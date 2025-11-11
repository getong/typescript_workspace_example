import { Module } from "@nestjs/common";
import { DiagnosticsModule } from "./diagnostics/diagnostics.module.js";
import { Libp2pModule } from "./libp2p/libp2p.module.js";
import { PeersModule } from "./peers/peers.module.js";
import { RedisModule } from "./redis/redis.module.js";
import { WorkersModule } from "./workers/workers.module.js";

@Module({
  imports: [
    RedisModule,
    Libp2pModule,
    PeersModule,
    DiagnosticsModule,
    WorkersModule,
  ],
})
export class AppModule {}
