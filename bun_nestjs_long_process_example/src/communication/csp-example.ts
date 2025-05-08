/**
 * CSP (Communicating Sequential Processes) Example
 * 
 * This file demonstrates how to implement CSP-style communication
 * using async generators and async iterators in TypeScript.
 */

// Generic channel implementation
class Channel<T> {
  private buffer: T[] = [];
  private senders: ((value: void) => void)[] = [];
  private receivers: ((value: IteratorResult<T>) => void)[] = [];
  private closed = false;

  // Send a value to the channel
  async send(value: T): Promise<void> {
    if (this.closed) {
      throw new Error("Cannot send on closed channel");
    }

    // If there's a waiting receiver, deliver the value directly
    if (this.receivers.length > 0) {
      const resolve = this.receivers.shift()!;
      resolve({ value, done: false });
      return;
    }

    // Otherwise, buffer the value and await someone to receive it
    this.buffer.push(value);
    
    // If buffer limit is reached, block the sender until space is available
    if (this.buffer.length > 100) { // Arbitrary buffer size limit
      return new Promise<void>(resolve => {
        this.senders.push(resolve);
      });
    }
  }

  // Receive a value from the channel
  async receive(): Promise<IteratorResult<T>> {
    // If there's a buffered value, deliver it
    if (this.buffer.length > 0) {
      const value = this.buffer.shift()!;
      
      // If there's a blocked sender, unblock it
      if (this.senders.length > 0) {
        const resolve = this.senders.shift()!;
        resolve();
      }
      
      return { value, done: false };
    }

    // If channel is closed and no more values, signal done
    if (this.closed) {
      return { value: undefined as any, done: true };
    }

    // Otherwise, wait for a value
    return new Promise<IteratorResult<T>>(resolve => {
      this.receivers.push(resolve);
    });
  }

  // Close the channel
  close(): void {
    this.closed = true;
    
    // Signal all waiting receivers that the channel is done
    for (const resolve of this.receivers) {
      resolve({ value: undefined as any, done: true });
    }
    this.receivers = [];
  }

  // Make the channel an async iterable
  async *[Symbol.asyncIterator](): AsyncIterableIterator<T> {
    while (true) {
      const result = await this.receive();
      if (result.done) break;
      yield result.value;
    }
  }
}

/**
 * Example: Long-running process using CSP pattern
 */

// Create the channels for input and output
const taskChannel = new Channel<{ taskId: string; duration: number }>();
const resultChannel = new Channel<{ taskId: string; result: any }>();

// Worker process (consumer of tasks, producer of results)
async function workerProcess() {
  console.log("[Worker] Started");
  
  // Process tasks from the task channel
  for await (const { taskId, duration } of taskChannel) {
    console.log(`[Worker] Processing task ${taskId} with duration ${duration}s`);
    
    // Simulate CPU-intensive work
    const startTime = Date.now();
    while (Date.now() - startTime < duration * 1000) {
      // Do some busy work
      for (let i = 0; i < 100000; i++) Math.sqrt(i);
    }
    
    // Send result to the result channel
    const result = {
      processedAt: new Date().toISOString(),
      duration: `${duration} seconds`,
      message: "Long-running task completed successfully"
    };
    
    await resultChannel.send({ taskId, result });
    console.log(`[Worker] Completed task ${taskId}`);
  }
  
  console.log("[Worker] Stopped");
}

// Task manager (producer of tasks, consumer of results)
async function taskManager() {
  console.log("[TaskManager] Started");
  
  // Map to store pending tasks
  const tasks = new Map<string, { 
    status: "pending" | "completed" | "failed"; 
    result?: any;
  }>();
  
  // Start the consumer for results
  (async () => {
    for await (const { taskId, result } of resultChannel) {
      console.log(`[TaskManager] Got result for task ${taskId}`);
      tasks.set(taskId, { status: "completed", result });
    }
  })();
  
  // Example: Schedule some tasks
  const task1Id = "task-1";
  const task2Id = "task-2";
  
  tasks.set(task1Id, { status: "pending" });
  tasks.set(task2Id, { status: "pending" });
  
  await taskChannel.send({ taskId: task1Id, duration: 2 });
  await taskChannel.send({ taskId: task2Id, duration: 3 });
  
  // Check status periodically
  for (let i = 0; i < 10; i++) {
    console.log(`[TaskManager] Current tasks status:`);
    for (const [id, task] of tasks.entries()) {
      console.log(`- ${id}: ${task.status}`);
    }
    
    // Wait a bit
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Clean up
  taskChannel.close();
  resultChannel.close();
  console.log("[TaskManager] Stopped");
}

// In a real application, these would run in separate contexts
// For example, a web worker would run workerProcess
async function main() {
  // Start both processes
  Promise.all([
    workerProcess(),
    taskManager()
  ]).catch(err => console.error("Error:", err));
}

// Run the example
if (require.main === module) {
  main();
}

export { Channel, taskChannel, resultChannel };
