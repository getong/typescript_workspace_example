import { parentPort, workerData } from "worker_threads";

// Function to simulate a heavy computation
function heavyComputation(duration: number) {
  const startTime = Date.now();

  // Simulate CPU-intensive work
  while (Date.now() - startTime < duration * 1000) {
    // Do some meaningless calculations
    for (let i = 0; i < 1000000; i++) {
      Math.sqrt(i);
    }
  }

  return {
    processedAt: new Date().toISOString(),
    duration: `${duration} seconds`,
    message: "Long-running task completed successfully",
  };
}

// Execute heavy computation
const result = heavyComputation(workerData.duration);

// Send the result back to the main thread
if (parentPort) {
  parentPort.postMessage(result);
}
