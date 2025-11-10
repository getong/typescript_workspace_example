import { Injectable } from "@nestjs/common";
import type { OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Worker } from "node:worker_threads";
import { createContextLogger } from "../logger.js";

type WorkerGroupConfig = {
  name: string;
  iterations: number;
  delayMs: number;
};

type ActiveWorker = {
  config: WorkerGroupConfig;
  worker: Worker;
};

const GROUPS: WorkerGroupConfig[] = [
  { name: "alpha", iterations: 4, delayMs: 350 },
  { name: "beta", iterations: 6, delayMs: 225 },
];

@Injectable()
export class WorkerManagerService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = createContextLogger(WorkerManagerService.name);
  private readonly workers = new Map<string, ActiveWorker>();

  async onModuleInit(): Promise<void> {
    this.logger.info(
      `Spawning ${GROUPS.length} worker threads for logging demo...`,
    );
    for (const group of GROUPS) {
      this.spawnWorker(group);
    }
  }

  async onModuleDestroy(): Promise<void> {
    await Promise.all(
      [...this.workers.entries()].map(([name, active]) =>
        this.stopWorker(name, active.worker),
      ),
    );
    this.workers.clear();
  }

  private spawnWorker(config: WorkerGroupConfig): void {
    const workerUrl = new URL("./log-worker.js", import.meta.url);
    const worker = new Worker(workerUrl, {
      workerData: config,
    });

    this.logger.info(`Worker ${config.name} spawned`, config);

    worker.on("message", (message) => {
      this.logger.info(
        `Worker ${config.name} reported ${message.type ?? "update"}`,
        message,
      );
    });

    worker.on("error", (error) => {
      this.logger.error(
        `Worker ${config.name} emitted error: ${error.message}`,
        {
          stack: error.stack,
        },
      );
      this.workers.delete(config.name);
    });

    worker.on("exit", (code) => {
      this.logger.info(`Worker ${config.name} exited with code ${code}`);
      this.workers.delete(config.name);
      if (code !== 0) {
        this.logger.warn(
          `Worker ${config.name} exited with non-zero code ${code}`,
        );
      }
    });

    this.workers.set(config.name, { config, worker });
  }

  private async stopWorker(name: string, worker: Worker): Promise<void> {
    this.logger.info(`Stopping worker ${name}`);
    try {
      await worker.terminate();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this.logger.warn(`Failed to stop worker ${name}: ${message}`);
    }
  }
}
