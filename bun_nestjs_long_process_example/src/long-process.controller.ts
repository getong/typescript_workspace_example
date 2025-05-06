import { Controller, Post, Get, Body } from "@nestjs/common";
import { LongProcessService } from "./long-process.service";

@Controller("long-process")
export class LongProcessController {
  constructor(private readonly longProcessService: LongProcessService) {}

  @Post("start")
  async startLongProcess(@Body() body: { duration: number }) {
    const taskId = await this.longProcessService.startLongRunningTask(
      body.duration,
    );
    return { taskId, message: "Task started" };
  }

  @Get("status/:id")
  async getTaskStatus(@Body() body: { taskId: string }) {
    const status = await this.longProcessService.checkTaskStatus(body.taskId);
    return { taskId: body.taskId, status };
  }
}
