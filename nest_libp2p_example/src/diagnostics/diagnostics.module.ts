import { Module } from "@nestjs/common";
import { Libp2pModule } from "../libp2p/libp2p.module.js";
import { DiagnosticsController } from "./diagnostics.controller.js";

@Module({
  imports: [Libp2pModule],
  controllers: [DiagnosticsController],
})
export class DiagnosticsModule {}
