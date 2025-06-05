import 'dotenv/config';
import { StreamChat } from 'stream-chat';

const client = new StreamChat(process.env.API_KEY!, process.env.API_SECRET!, {
  disableCache: true, // recommended option for server-side use
  // ...other options like `baseURL`...
});

// create a user
await client.upsertUser({
  id: 'vishal-1',
  name: 'Vishal',
});

// create a channel
const channel = client.channel('messaging', 'test-channel', {
  created_by_id: 'vishal-1',
});
await channel.create();

// send message
const { message } = await channel.sendMessage({ text: 'This is a test message' });

// send reaction
await channel.sendReaction(message.id, { type: 'love', user: { id: 'vishal-1' } });