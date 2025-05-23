/**
 * Standalone examples of Promise patterns from the blog post
 * @see https://deep.tacoskingdom.com/blog/163
 */
import * as PromiseUtils from "./promise-utils";

async function demonstrateBlogPatterns(): Promise<void> {
  console.log("Starting blog pattern demonstrations...");

  // 1. Simple delay usage
  console.log("\n1. Delay demonstration:");
  console.log("   Waiting for 1 second...");
  await PromiseUtils.delay(1000);
  console.log("   Delay completed");

  // 2. Timeout pattern
  console.log("\n2. Timeout demonstration:");
  try {
    console.log("   Starting a task that will time out...");

    await Promise.race([
      (async () => {
        await PromiseUtils.delay(3000);
        return "This should never resolve";
      })(),
      PromiseUtils.timeout(1000, "Custom timeout message"),
    ]);

    console.log("   This should not be printed");
  } catch (error) {
    console.log(`   Task timed out as expected: ${error.message}`);
  }

  // 3. With Timeout utility
  console.log("\n3. WithTimeout utility:");
  try {
    console.log("   Starting a long task with timeout protection...");

    await PromiseUtils.withTimeout(
      (async () => {
        await PromiseUtils.delay(2000);
        return "Task result";
      })(),
      1000,
      "Task took too long",
    );
  } catch (error) {
    console.log(`   Task timed out as expected: ${error.message}`);
  }

  // 4. Retry pattern
  console.log("\n4. Retry pattern:");
  {
    let attempts = 0;

    const unreliableFunction = async (): Promise<string> => {
      attempts++;
      console.log(`   Attempt #${attempts}`);

      if (attempts <= 2) {
        throw new Error("Simulated failure");
      }

      return "Success on attempt #" + attempts;
    };

    try {
      const result = await PromiseUtils.retry(
        unreliableFunction,
        3, // 3 retries
        200, // 200ms initial delay
        1.5, // 1.5x backoff multiplier
      );

      console.log(`   Retry succeeded: ${result}`);
    } catch (error) {
      console.log(`   All retries failed: ${error.message}`);
    }
  }

  // 5. Memoization
  console.log("\n5. Memoization pattern:");
  {
    const expensiveCalculation = async (
      a: number,
      b: number,
    ): Promise<number> => {
      console.log(`   Calculating ${a} + ${b} (expensive operation)`);
      await PromiseUtils.delay(500); // Simulate expensive operation
      return a + b;
    };

    const memoizedCalculation = PromiseUtils.memoizePromise(
      expensiveCalculation,
      (a, b) => `${a}+${b}`,
      5000, // 5 seconds TTL
    );

    console.log("   First call for 5+7:");
    const result1 = await memoizedCalculation(5, 7);
    console.log(`   Result: ${result1}`);

    console.log("   Second call for 5+7 (should use cache):");
    const result2 = await memoizedCalculation(5, 7);
    console.log(`   Result: ${result2}`);

    console.log("   Call for different values 8+2:");
    const result3 = await memoizedCalculation(8, 2);
    console.log(`   Result: ${result3}`);
  }

  // 6. Debounce
  console.log("\n6. Debounce pattern:");
  {
    const searchAPI = async (term: string): Promise<string[]> => {
      console.log(`   Actually searching for: ${term}`);
      await PromiseUtils.delay(300);
      return [`Result 1 for ${term}`, `Result 2 for ${term}`];
    };

    const debouncedSearch = PromiseUtils.debouncePromise(searchAPI, 500);

    console.log("   Making rapid search requests (only last should execute):");
    // These should be ignored due to debouncing
    debouncedSearch("a");
    debouncedSearch("ap");
    debouncedSearch("app");

    // Only this one should execute after the debounce period
    const results = await debouncedSearch("apple");
    await PromiseUtils.delay(600); // Wait for debounced function to complete

    console.log(`   Got ${results.length} results: ${results.join(", ")}`);
  }

  console.log("\nAll blog pattern demonstrations completed!");
}

// Run the examples
demonstrateBlogPatterns().catch(console.error);
