import { Module } from "@nestjs/common";
import { Libp2pService } from "./libp2p.service.js";

@Module({
  providers: [Libp2pService],
  exports: [Libp2pService],
})
export class Libp2pModule {}
