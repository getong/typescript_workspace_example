import { Controller, Post, Get, Body, Param } from "@nestjs/common";
import { LongProcessService } from "./long-process.service";

/**
 * Controller handling HTTP requests for long-running processes.
 * Acts as the entry point for client requests and communicates with the service layer.
 */
@Controller("long-process")
export class LongProcessController {
  constructor(private readonly longProcessService: LongProcessService) {}

  /**
   * Endpoint to start a long-running task
   *
   * Communication flow:
   * 1. Client -> Controller: Client sends duration parameter
   * 2. Controller -> Service: Controller delegates task creation to service
   * 3. Service -> Worker: Service spawns a worker thread to handle the task
   * 4. Worker -> Service: Worker sends results back to the service
   * 5. Service -> Controller: Service updates task status
   * 6. Controller -> Client: Returns task ID for status tracking
   */
  @Post("start")
  async startLongProcess(@Body() body: { duration: number }) {
    const taskId = await this.longProcessService.startLongRunningTask(
      body.duration,
    );
    return { taskId, message: "Task started" };
  }

  /**
   * Endpoint to check status of a previously started task
   *
   * Communication flow:
   * 1. Client -> Controller: Client sends task ID
   * 2. Controller -> Service: Requests current status
   * 3. Service -> Controller: Returns current task state (pending/completed/failed)
   * 4. Controller -> Client: Returns status and result if completed
   */
  @Get("status/:id")
  async getTaskStatus(@Param('id') taskId: string) {
    const status = await this.longProcessService.checkTaskStatus(taskId);
    return { taskId, status };
  }
}
