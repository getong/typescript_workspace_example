# Integrating Communication Models into NestJS

This document explains how to integrate the CSP and Actor Model communication patterns into the existing NestJS application.

## Integrating CSP

To integrate the CSP model:

1. Create a service that manages channels:

```typescript
@Injectable()
export class CspLongProcessService {
  private taskChannel = new Channel<{ taskId: string; duration: number }>();
  private resultChannel = new Channel<{ taskId: string; result: any }>();
  private tasks = new Map<string, { status: string; result?: any }>();

  constructor() {
    // Start the worker process
    this.startWorker();
    
    // Start the result consumer
    this.consumeResults();
  }

  private async startWorker() {
    for await (const { taskId, duration } of this.taskChannel) {
      // Process task in worker thread
      const worker = new Worker(join(__dirname, "workers", "long-process.worker.js"), {
        workerData: { taskId, duration },
      });

      worker.on("message", (result) => {
        this.resultChannel.send({ taskId, result }).catch(err => 
          console.error(`Failed to send result for task ${taskId}:`, err));
      });
    }
  }

  private async consumeResults() {
    for await (const { taskId, result } of this.resultChannel) {
      this.tasks.set(taskId, { status: "completed", result });
    }
  }

  async startLongRunningTask(duration: number): Promise<string> {
    const taskId = uuidv4();
    this.tasks.set(taskId, { status: "pending" });
    
    await this.taskChannel.send({ taskId, duration });
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
```

## Integrating Actor Model

To integrate the Actor Model:

1. Create a service that uses actors:

```typescript
@Injectable()
export class ActorLongProcessService implements OnModuleInit {
  private taskManager: TaskManagerActor;
  private taskManagerRef: ActorRef<Message>;
  private client: ClientActor;

  constructor() {
    // Create the actor system
    this.taskManager = new TaskManagerActor(4); // 4 workers
    this.taskManagerRef = this.taskManager.ref();
    this.client = new ClientActor(this.taskManagerRef);
  }

  onModuleInit() {
    // Nothing needed here as actors start automatically
  }

  async startLongRunningTask(duration: number): Promise<string> {
    const taskId = uuidv4();
    
    // Send message to start task
    this.client.startTask(taskId, duration);
    
    return taskId;
  }

  async checkTaskStatus(taskId: string): Promise<any> {
    return new Promise((resolve) => {
      // Create a temporary actor to receive the response
      class TempActor extends Actor<Message> {
        constructor(private resolver: (result: any) => void) {
          super();
        }
        
        protected receive(message: Message): void {
          if (message.type === 'STATUS_RESULT' && message.taskId === taskId) {
            this.resolver(message.status);
          }
        }
      }
      
      const tempActor = new TempActor(resolve);
      
      // Request status
      this.taskManagerRef.send({
        type: 'GET_STATUS',
        taskId,
        replyTo: tempActor.ref()
      });
    });
  }
}
```

## Comparison of Implementation Approaches

Both models have their strengths:

### CSP Approach
- Natural fit for streaming data processing pipelines
- Cleaner separation of concerns
- Simpler control flow with async iterators
- Better for backpressure handling

### Actor Model Approach
- Better encapsulation of state
- More flexible message passing patterns
- Natural fit for distributed systems
- Easier to implement supervision hierarchies

## Recommendation

- Use CSP when you have well-defined data flows between components
- Use Actor Model when you need flexible message routing and state management
- Consider a hybrid approach where actors use channels internally for specific operations
