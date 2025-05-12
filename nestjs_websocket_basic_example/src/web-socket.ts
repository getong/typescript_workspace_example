import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  // WsResponse is not exported from @nestjs/websockets in the current version
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Logger } from "@nestjs/common";

// Define the WsResponse interface locally
interface WsResponse<T> {
  event: string;
  data: T;
}

// Update the token validation function to accept socket IDs
function validateToken(token: string): any {
  // This is just a simple example implementation
  if (token === "valid-token" || token.includes("-")) { // Accept "valid-token" or socket IDs (which contain hyphens)
    return { 
      id: token === "valid-token" ? 1 : token,
      username: token === "valid-token" ? "testuser" : `user-${token.substring(0, 6)}`
    };
  }
  throw new Error("Invalid token");
}

@WebSocketGateway({
  cors: {
    origin: "*", // In production, specify your actual origins
  },
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private logger: Logger = new Logger("AppGateway");

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    this.logger.log("WebSocket Gateway initialized");
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage("message")
  handleMessage(client: Socket, payload: any): WsResponse<string> {
    this.logger.log(`Received message: ${JSON.stringify(payload)}`);
    return { event: "messageResponse", data: "Hello world!" };
  }

  @SubscribeMessage("joinRoom")
  handleRoomJoin(client: Socket, room: string) {
    client.join(room);
    this.logger.log(`Client ${client.id} joined room: ${room}`);
    client.emit("joinedRoom", room);

    // Broadcast to other clients in the room
    client.to(room).emit("userJoined", {
      userId: client.id,
      room,
    });
  }

  @SubscribeMessage("leaveRoom")
  handleRoomLeave(client: Socket, room: string) {
    client.leave(room);
    this.logger.log(`Client ${client.id} left room: ${room}`);
    client.emit("leftRoom", room);

    // Broadcast to other clients in the room
    client.to(room).emit("userLeft", {
      userId: client.id,
      room,
    });
  }

  @SubscribeMessage("chatToRoom")
  handleRoomMessage(
    client: Socket,
    payload: { room: string; message: string },
  ) {
    const { room, message } = payload;
    this.logger.log(`Message to room ${room}: ${message}`);

    // Broadcast message to all clients in the room
    this.server.to(room).emit("roomMessage", {
      sender: client.id,
      room,
      message,
      timestamp: new Date().toISOString(),
    });
  }

  @SubscribeMessage("authenticate")
  handleAuthentication(client: Socket, token: string) {
    try {
      // Logic to validate the token
      const user = validateToken(token);
      client.data.user = user; // Store user data in socket
      this.logger.log(`Client ${client.id} authenticated as ${user.username}`);
      client.emit("authenticated", {
        success: true,
        user: { id: user.id, username: user.username },
      });
    } catch (e) {
      this.logger.error(`Authentication failed for client ${client.id}: ${(e as Error).message}`);
      client.emit("error", `Authentication failed: ${(e as Error).message}`);
    }
  }
}
