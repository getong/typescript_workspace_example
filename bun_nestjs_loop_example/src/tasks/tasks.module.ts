import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { TasksService } from "./tasks.service";
import { DataFetcherService } from "./data-fetcher.service";
import { TasksController } from "./tasks.controller";

@Module({
  imports: [ScheduleModule.forRoot()],
  controllers: [TasksController],
  providers: [
    // Explicitly define the provider with a token
    {
      provide: DataFetcherService,
      useClass: DataFetcherService,
    },
    TasksService,
  ],
  exports: [TasksService, DataFetcherService],
})
export class TasksModule {}
