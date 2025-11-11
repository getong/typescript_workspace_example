import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NodeJoinLogEntity } from "../database/entities/node-join-log.entity.js";
import { ConnectionLogsService } from "./connection-logs.service.js";
import { Libp2pService } from "./libp2p.service.js";

@Module({
  imports: [TypeOrmModule.forFeature([NodeJoinLogEntity])],
  providers: [Libp2pService, ConnectionLogsService],
  exports: [Libp2pService],
})
export class Libp2pModule {}
