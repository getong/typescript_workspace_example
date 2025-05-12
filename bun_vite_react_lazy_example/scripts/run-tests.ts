import { execa } from 'execa';

// Execute vitest with happy-dom environment
async function runTests() {
  try {
    const result = await execa('npx', ['vitest', 'run', '--environment', 'happy-dom']);
    console.log(result.stdout);
  } catch (error: any) {
    console.error('Test execution failed:', error.message);
    process.exit(1);
  }
}

runTests();
