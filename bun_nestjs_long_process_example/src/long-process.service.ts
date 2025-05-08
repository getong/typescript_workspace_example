import { Injectable } from "@nestjs/common";
import { Worker } from "worker_threads";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

/**
 * Interface representing task data structure
 */
interface TaskInfo {
  status: "pending" | "completed" | "failed";
  result?: any;
  startedAt?: Date;
}

/**
 * Service responsible for managing long-running tasks using worker threads
 * This acts as the communication bridge between the controller and worker threads
 */
@Injectable()
export class LongProcessService {
  // In-memory storage for task statuses
  private tasks = new Map<string, TaskInfo>();

  /**
   * Starts a long-running task in a separate worker thread
   *
   * Communication flow:
   * 1. Controller -> Service: Requests to start task with duration
   * 2. Service -> Worker: Creates worker thread and passes duration
   * 3. Worker -> Service (later): Will send result via message event
   * 4. Service -> Controller: Immediately returns task ID (non-blocking)
   */
  async startLongRunningTask(duration: number): Promise<string> {
    const taskId = uuidv4();

    // Set initial status
    this.tasks.set(taskId, {
      status: "pending",
      startedAt: new Date(),
    });

    // Create worker in another thread
    // This is the key step that initiates communication with the worker
    const worker = new Worker(
      join(__dirname, "workers", "long-process.worker.js"),
      {
        workerData: { duration }, // Pass data to worker
      },
    );

    // Set up event listeners for worker communication
    // Worker communicates back to service through these events

    // Handle successful completion
    worker.on("message", (result) => {
      console.log(`Worker completed task ${taskId} with result:`, result);
      this.tasks.set(taskId, { status: "completed", result });
    });

    // Handle errors
    worker.on("error", (error) => {
      console.error(`Worker error for task ${taskId}: ${error}`);
      this.tasks.set(taskId, { status: "failed", result: error.message });
    });

    // Cleanup when worker exits
    worker.on("exit", (code) => {
      if (code !== 0) {
        console.warn(`Worker for task ${taskId} stopped with exit code ${code}`);
      }
    });

    return taskId;
  }

  /**
   * Check the status of a previously started task
   *
   * Communication flow:
   * 1. Controller -> Service: Requests status using task ID
   * 2. Service -> Controller: Returns current state from task map
   */
  async checkTaskStatus(taskId: string): Promise<any> {
    const task = this.tasks.get(taskId);
    if (!task) {
      return { status: "not_found" };
    }
    return task;
  }
}
