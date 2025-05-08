import { parentPort, workerData } from "worker_threads";

/**
 * Worker Thread for CPU-intensive operations
 *
 * Communication flow:
 * 1. Service -> Worker: Creates worker with workerData containing duration
 * 2. Worker: Processes task independently in separate thread
 * 3. Worker -> Service: Returns result via parentPort.postMessage
 */

// Access parameters passed from the service
const { duration } = workerData;
console.log(`Worker started with duration: ${duration} seconds`);

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
const result = heavyComputation(duration);

// Send the result back to the main thread (service)
// This is how the worker communicates back to the service
if (parentPort) {
  console.log("Worker completed, sending result back to main thread");
  parentPort.postMessage(result);
} else {
  console.error("No parent port found to send results");
}

// Worker will automatically exit after sending the message
console.log("Worker thread terminating");
