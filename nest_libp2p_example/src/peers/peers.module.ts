import { Module } from "@nestjs/common";
import { Libp2pModule } from "../libp2p/libp2p.module.js";
import { PeersController } from "./peers.controller.js";

@Module({
  imports: [Libp2pModule],
  controllers: [PeersController],
})
export class PeersModule {}
