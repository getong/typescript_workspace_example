import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'happy-dom', // or 'jsdom'
    globals: true,
    setupFiles: ['./src/setup-tests.ts'],
  },
});
