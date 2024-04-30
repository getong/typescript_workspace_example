import * as net from 'net';
import { Request, Response } from './proto/person'; // Import generated protobuf messages

const HOST = 'localhost';
const PORT = 3000;

const client = new net.Socket();

client.connect(PORT, HOST, () => {
    console.log('Connected to server');

    // Create a new request
    const request: Request = {query: "abc"};

    // Send the request to the server
    client.write(Request.encode(request).finish());
});

client.on('data', (data: Buffer) => {
    // Parse the received data as a Response message
    const response = Response.decode(data);
    console.log('Received response:', response.result);
});

client.on('close', () => {
    console.log('Connection closed');
});
