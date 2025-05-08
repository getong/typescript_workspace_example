/**
 * Actor Model Example
 * 
 * This file demonstrates how to implement the Actor Model
 * in TypeScript for concurrent task processing.
 */

// Message types for our actor system
type Message = 
  | { type: 'START_TASK'; taskId: string; duration: number }
  | { type: 'TASK_COMPLETED'; taskId: string; result: any }
  | { type: 'GET_STATUS'; taskId: string; replyTo: ActorRef<any> }
  | { type: 'STATUS_RESULT'; taskId: string; status: TaskStatus };

// Task status type
type TaskStatus = {
  status: 'pending' | 'completed' | 'failed';
  result?: any;
};

// Actor reference - a handle to send messages to an actor
class ActorRef<T extends Message> {
  constructor(private mailbox: (msg: T) => void) {}

  // Send a message to this actor
  send(message: T): void {
    this.mailbox(message);
  }
}

// Base Actor class
abstract class Actor<T extends Message> {
  private queue: T[] = [];
  private processing = false;
  
  // Each actor must implement this method to process messages
  protected abstract receive(message: T): void | Promise<void>;
  
  // Get a reference to this actor
  ref(): ActorRef<T> {
    return new ActorRef<T>(msg => this.enqueue(msg));
  }

  // Enqueue a message in this actor's mailbox
  private enqueue(message: T): void {
    this.queue.push(message);
    this.processQueue();
  }

  // Process the next message in the queue
  private async processQueue(): Promise<void> {
    // Only one message processed at a time
    if (this.processing || this.queue.length === 0) return;
    
    this.processing = true;
    const message = this.queue.shift()!;
    
    try {
      await Promise.resolve(this.receive(message));
    } catch (error) {
      console.error('Error processing message:', error);
    }
    
    this.processing = false;
    this.processQueue();
  }
}

// Worker Actor - processes tasks
class WorkerActor extends Actor<Message> {
  constructor(private taskManagerRef: ActorRef<Message>) {
    super();
  }

  protected async receive(message: Message): Promise<void> {
    if (message.type === 'START_TASK') {
      console.log(`[Worker] Processing task ${message.taskId} (${message.duration}s)`);
      
      // Simulate CPU-intensive work
      const startTime = Date.now();
      while (Date.now() - startTime < message.duration * 1000) {
        // Do some busy work
        for (let i = 0; i < 100000; i++) Math.sqrt(i);
      }
      
      // Send result back to task manager
      const result = {
        processedAt: new Date().toISOString(),
        duration: `${message.duration} seconds`,
        message: "Long-running task completed successfully"
      };
      
      this.taskManagerRef.send({
        type: 'TASK_COMPLETED',
        taskId: message.taskId,
        result
      });
    }
  }
}

// Task Manager Actor - manages tasks and their status
class TaskManagerActor extends Actor<Message> {
  private tasks = new Map<string, TaskStatus>();
  private workers: ActorRef<Message>[] = [];
  
  constructor(numWorkers: number) {
    super();
    
    // Create worker actors
    for (let i = 0; i < numWorkers; i++) {
      const worker = new WorkerActor(this.ref());
      this.workers.push(worker.ref());
    }
  }

  protected receive(message: Message): void {
    switch (message.type) {
      case 'START_TASK':
        // Create a new task
        this.tasks.set(message.taskId, { status: 'pending' });
        
        // Distribute to a worker (simple round robin)
        const workerIndex = this.tasks.size % this.workers.length;
        this.workers[workerIndex].send(message);
        break;
        
      case 'TASK_COMPLETED':
        // Update task status when completed
        this.tasks.set(message.taskId, {
          status: 'completed',
          result: message.result
        });
        console.log(`[TaskManager] Task ${message.taskId} completed`);
        break;
        
      case 'GET_STATUS':
        // Reply with the current status of a task
        const task = this.tasks.get(message.taskId) || { status: 'not_found' };
        message.replyTo.send({
          type: 'STATUS_RESULT',
          taskId: message.taskId,
          status: task
        });
        break;
    }
  }
}

// Client Actor - interacts with the task manager
class ClientActor extends Actor<Message> {
  constructor(private taskManagerRef: ActorRef<Message>) {
    super();
  }

  // Method to start a task
  startTask(taskId: string, duration: number): void {
    this.taskManagerRef.send({
      type: 'START_TASK',
      taskId,
      duration
    });
    console.log(`[Client] Requested task ${taskId} start`);
  }
  
  // Method to check task status
  checkStatus(taskId: string): void {
    this.taskManagerRef.send({
      type: 'GET_STATUS',
      taskId,
      replyTo: this.ref()
    });
  }

  protected receive(message: Message): void {
    if (message.type === 'STATUS_RESULT') {
      console.log(`[Client] Status for task ${message.taskId}:`, message.status);
    }
  }
}

// Example usage
async function main() {
  console.log("Starting Actor Model Example");
  
  // Create the task manager with 2 workers
  const taskManager = new TaskManagerActor(2);
  const taskManagerRef = taskManager.ref();
  
  // Create a client
  const client = new ClientActor(taskManagerRef);
  
  // Start some tasks
  client.startTask('task-1', 2);
  client.startTask('task-2', 3);
  
  // Periodically check status
  for (let i = 0; i < 5; i++) {
    await new Promise(resolve => setTimeout(resolve, 1000));
    client.checkStatus('task-1');
    client.checkStatus('task-2');
  }
}

// Run the example
if (require.main === module) {
  main();
}

export { Actor, ActorRef, TaskManagerActor, WorkerActor, ClientActor };
