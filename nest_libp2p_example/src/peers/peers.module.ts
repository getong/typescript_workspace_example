import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DialRequestEntity } from "../database/entities/dial-request.entity.js";
import { Libp2pModule } from "../libp2p/libp2p.module.js";
import { DialRequestsService } from "./dial-requests.service.js";
import { PeersController } from "./peers.controller.js";

@Module({
  imports: [Libp2pModule, TypeOrmModule.forFeature([DialRequestEntity])],
  providers: [DialRequestsService],
  controllers: [PeersController],
})
export class PeersModule {}
