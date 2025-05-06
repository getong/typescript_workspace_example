import { Injectable } from "@nestjs/common";
import { Worker } from "worker_threads";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class LongProcessService {
  private tasks = new Map<
    string,
    { status: "pending" | "completed" | "failed"; result?: any }
  >();

  async startLongRunningTask(duration: number): Promise<string> {
    const taskId = uuidv4();

    // Set initial status
    this.tasks.set(taskId, { status: "pending" });

    // Create worker in another thread
    const worker = new Worker(
      join(__dirname, "workers", "long-process.worker.js"),
      {
        workerData: { duration },
      },
    );

    // Handle worker events
    worker.on("message", (result) => {
      this.tasks.set(taskId, { status: "completed", result });
    });

    worker.on("error", (error) => {
      console.error(`Worker error: ${error}`);
      this.tasks.set(taskId, { status: "failed", result: error.message });
    });

    return taskId;
  }

  async checkTaskStatus(taskId: string): Promise<any> {
    const task = this.tasks.get(taskId);
    if (!task) {
      return { status: "not_found" };
    }
    return task;
  }
}
