import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['test/**/*.spec.ts', 'test/**/*.test.ts'],
    globals: true,
    testTimeout: 10000, // Increase timeout to 10 seconds
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/']
    },
    setupFiles: ['test/setup.ts'], // Setup file for global test configuration
    teardownTimeout: 5000, // Increase teardown timeout
    hookTimeout: 10000, // Increase hook timeout
    isolate: false,  // Don't isolate tests to prevent socket issues
    pool: 'forks', // Use forks for better test isolation
    poolOptions: {
      forks: {
        singleFork: true, // Use a single fork for all tests
      },
    },
    forceExit: true, // Force exit after tests complete
  },
});
