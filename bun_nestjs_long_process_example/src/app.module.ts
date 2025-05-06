import { Module } from "@nestjs/common";
import { LongProcessController } from "./long-process.controller";
import { LongProcessService } from "./long-process.service";

@Module({
  imports: [],
  controllers: [LongProcessController],
  providers: [LongProcessService],
})
export class AppModule {}
