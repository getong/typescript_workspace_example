// Global setup for tests
import { afterAll } from 'vitest';

// Global cleanup function
afterAll(async () => {
  // Add a slight delay to ensure test processes have time to clean up
  await new Promise(resolve => setTimeout(resolve, 500));
}, { timeout: 5000 });

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});
