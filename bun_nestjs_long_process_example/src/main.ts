import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

/**
 * Complete communication flow in this application:
 * 
 * ┌──────────┐      ┌──────────────────┐      ┌───────────────────┐      ┌─────────────────┐
 * │          │      │                  │      │                   │      │                 │
 * │  Client  │ HTTP │    Controller    │ Call │      Service      │ Fork │  Worker Thread  │
 * │          │─────>│                  │─────>│                   │─────>│                 │
 * └──────────┘      └──────────────────┘      └───────────────────┘      └─────────────────┘
 *      │                     │                        │                          │
 *      │                     │                        │                          │
 *      │                     │                        │       (Processing)       │
 *      │                     │                        │                          │
 *      │                     │                        │      postMessage()       │
 *      │                     │                        │<─────────────────────────┘
 *      │   HTTP Response     │      Return Status     │
 *      │<────────────────────│<───────────────────────┘
 *      │                     │                        
 *      │   Poll Status       │                        
 *      │─────────────────────>                        
 *      │                     │                        
 *      │                     │─────┐                  
 *      │                     │     │ Check Status     
 *      │                     │<────┘                  
 *      │                     │                        
 *      │   Status Response   │                        
 *      │<────────────────────│                        
 */

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  console.log("NestJS application running on port 3000");
}

bootstrap();
