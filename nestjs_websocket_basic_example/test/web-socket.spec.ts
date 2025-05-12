import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { io, Socket } from 'socket.io-client';
import { describe, beforeAll, afterAll, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { AppGateway } from '../src/web-socket';

// Create a manual mock instead of using vi.mock
const originalModule = await import('../src/utils/token-validator');

// Override the validateToken function for testing
const mockValidateToken = (token: string) => {
  if (token === 'valid-token') {
    return { id: 1, username: 'testuser' };
  }
  if (token.includes('-')) {
    return { id: token, username: `user-${token.substring(0, 6)}` };
  }
  throw new Error('Invalid token');
};

describe('WebSocket Gateway', () => {
  let app: INestApplication;
  let clientSocket: Socket;
  let gateway: AppGateway;
  const serverPort = 3001;
  
  // Track event listeners to clean up
  const eventCleanupList = [];

  // Helper to add event listeners with automatic cleanup
  const addSocketEvent = (socket, event, handler) => {
    socket.on(event, handler);
    eventCleanupList.push(() => socket.off(event, handler));
    return handler;
  };

  beforeAll(async () => {
    // Override the validateToken function for testing
    vi.spyOn(originalModule, 'validateToken').mockImplementation(mockValidateToken);

    // Create the NestJS testing module
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    gateway = moduleRef.get<AppGateway>(AppGateway);
    app = moduleRef.createNestApplication();
    await app.listen(serverPort);

    // Create the client socket
    clientSocket = io(`http://localhost:${serverPort}`, {
      transports: ['websocket'],
      autoConnect: false,
    });

    // Connect to the socket server
    clientSocket.connect();
    
    // Wait for connection to be established
    await new Promise<void>((resolve, reject) => {
      const connectTimeout = setTimeout(() => {
        reject(new Error('Socket connection timeout'));
      }, 5000);
      
      addSocketEvent(clientSocket, 'connect', () => {
        clearTimeout(connectTimeout);
        resolve();
      });
    });
  });

  // Clean up after each test to prevent memory leaks
  afterEach(() => {
    // Clean up event listeners
    while (eventCleanupList.length) {
      const cleanup = eventCleanupList.pop();
      cleanup();
    }
  });

  afterAll(async () => {
    // Clean up all listeners
    clientSocket.removeAllListeners();
    
    // Disconnect socket
    if (clientSocket.connected) {
      clientSocket.disconnect();
    }
    
    // Close NestJS app
    if (app) {
      await app.close();
    }
    
    // Restore mocks
    vi.restoreAllMocks();
  });

  it('should connect to the socket server', async () => {
    expect(clientSocket.connected).toBe(true);
  });

  it('should receive response when sending a message', async () => {
    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Test timed out waiting for message response'));
      }, 2000);
      
      const responseHandler = (data) => {
        clearTimeout(timeout);
        expect(data).toBe('Hello world!');
        resolve();
      };
      
      addSocketEvent(clientSocket, 'messageResponse', responseHandler);
      clientSocket.emit('message', { text: 'Hello from test' });
    });
  });

  it('should authenticate with valid token', async () => {
    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Test timed out waiting for authentication'));
      }, 2000);
      
      const authHandler = (data) => {
        clearTimeout(timeout);
        expect(data.success).toBe(true);
        expect(data.user.username).toBe('testuser');
        resolve();
      };
      
      addSocketEvent(clientSocket, 'authenticated', authHandler);
      clientSocket.emit('authenticate', 'valid-token');
    });
  });

  it('should authenticate with a mock socket ID', async () => {
    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Test timed out waiting for socket ID authentication'));
      }, 2000);
      
      const authHandler = (data) => {
        clearTimeout(timeout);
        expect(data.success).toBe(true);
        expect(data.user.username).toBe('user-mock-s');
        resolve();
      };
      
      const errorHandler = (error) => {
        clearTimeout(timeout);
        reject(new Error(`Authentication failed: ${error}`));
      };
      
      addSocketEvent(clientSocket, 'authenticated', authHandler);
      addSocketEvent(clientSocket, 'error', errorHandler);
      
      clientSocket.emit('authenticate', 'mock-socket-id-123');
    });
  });

  it('should join a room', async () => {
    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Test timed out waiting for room join'));
      }, 2000);
      
      const roomHandler = (room) => {
        clearTimeout(timeout);
        expect(room).toBe('test-room');
        resolve();
      };
      
      addSocketEvent(clientSocket, 'joinedRoom', roomHandler);
      clientSocket.emit('joinRoom', 'test-room');
    });
  });

  it('should leave a room', async () => {
    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Test timed out waiting for room leave'));
      }, 2000);
      
      const leaveHandler = (room) => {
        clearTimeout(timeout);
        expect(room).toBe('test-room');
        resolve();
      };
      
      addSocketEvent(clientSocket, 'leftRoom', leaveHandler);
      clientSocket.emit('leaveRoom', 'test-room');
    });
  });

  it('should send message to room and receive it', async () => {
    const roomName = 'test-message-room';
    const testMessage = 'Hello room from test';
    
    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        reject(new Error('Test timed out waiting for room message'));
      }, 2000);
      
      const messageHandler = (data) => {
        clearTimeout(timeout);
        expect(data.room).toBe(roomName);
        expect(data.message).toBe(testMessage);
        expect(data.sender).toBe(clientSocket.id);
        expect(data.timestamp).toBeDefined();
        resolve();
      };
      
      const joinHandler = (room) => {
        if (room === roomName) {
          // Send message to the room after joining
          clientSocket.emit('chatToRoom', { room: roomName, message: testMessage });
        }
      };
      
      // Set up handlers
      addSocketEvent(clientSocket, 'roomMessage', messageHandler);
      addSocketEvent(clientSocket, 'joinedRoom', joinHandler);
      
      // Join the room
      clientSocket.emit('joinRoom', roomName);
    });
  });
});
