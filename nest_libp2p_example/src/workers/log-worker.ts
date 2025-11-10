import { parentPort, threadId, workerData } from "node:worker_threads";
import { setTimeout as delay } from "node:timers/promises";
import { createContextLogger } from "../logger.js";

type WorkerConfig = {
  name?: string;
  iterations?: number;
  delayMs?: number;
};

const config = (workerData ?? {}) as WorkerConfig;
const workerName = config.name ?? `worker-${threadId}`;
const iterations = Number(config.iterations ?? 5);
const delayMs = Number(config.delayMs ?? 250);

const workerLogger = createContextLogger(`Worker:${workerName}`);

async function run(): Promise<void> {
  workerLogger.info(`Worker ${workerName} starting`, {
    iterations,
    delayMs,
  });

  for (let i = 1; i <= iterations; i += 1) {
    workerLogger.debug(`Worker ${workerName} tick ${i}`);
    await delay(delayMs);
  }

  workerLogger.info(`Worker ${workerName} finished`, {
    iterations,
  });

  parentPort?.postMessage({
    type: "worker:done",
    name: workerName,
    iterations,
  });
}

run().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  workerLogger.error(`Worker ${workerName} failed: ${message}`, {
    stack: error instanceof Error ? error.stack : undefined,
  });
  parentPort?.postMessage({
    type: "worker:error",
    name: workerName,
    error: message,
  });
});
