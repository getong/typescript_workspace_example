import { Module } from "@nestjs/common";
import { WorkerManagerService } from "./worker-manager.service.js";

@Module({
  providers: [WorkerManagerService],
})
export class WorkersModule {}
