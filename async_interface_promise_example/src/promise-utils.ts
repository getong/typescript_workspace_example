/**
 * Promise utility functions inspired by "Promise patterns in JavaScript/TypeScript"
 * @see https://deep.tacoskingdom.com/blog/163
 */

/**
 * Creates a promise that resolves after a specified delay
 * @param ms Milliseconds to delay
 * @returns Promise that resolves after the delay
 */
export function delay(ms: number): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

/**
 * Creates a promise that will be rejected after a specified timeout
 * @param ms Milliseconds before timeout
 * @param message Optional error message
 * @returns Promise that rejects after timeout
 */
export function timeout(
  ms: number,
  message: string = "Operation timed out",
): Promise<never> {
  return new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(message)), ms);
  });
}

/**
 * Wraps a promise with a timeout
 * @param promise The promise to wrap with timeout
 * @param ms Milliseconds before timeout
 * @param message Optional error message
 * @returns Promise that resolves if original promise resolves before timeout
 */
export function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  message: string = "Operation timed out",
): Promise<T> {
  return Promise.race([promise, timeout(ms, message)]) as Promise<T>;
}

/**
 * Retries a promise-returning function until it succeeds or max retries is reached
 * @param fn Function that returns a promise
 * @param retries Maximum number of retry attempts
 * @param delayMs Milliseconds to wait between retries
 * @param backoff Multiplier for delay between retries (exponential backoff)
 * @returns Promise from the function, with retry logic
 */
export async function retry<T>(
  fn: () => Promise<T>,
  retries: number = 3,
  delayMs: number = 300,
  backoff: number = 2,
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (retries <= 0) throw error;

    // Wait before retrying
    await delay(delayMs);

    // Retry with one fewer retry and increased delay
    return retry(fn, retries - 1, delayMs * backoff, backoff);
  }
}

/**
 * Creates a debounced version of a promise-returning function
 * @param fn Function to debounce
 * @param waitMs Milliseconds to wait before executing
 * @returns Debounced function
 */
export function debouncePromise<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  waitMs: number,
): (...args: Args) => Promise<T> {
  let timeout: NodeJS.Timeout | null = null;
  let resolveRef: ((value: T) => void) | null = null;
  let rejectRef: ((reason: any) => void) | null = null;

  return function (...args: Args): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      if (timeout) {
        clearTimeout(timeout);
        // If there's an existing promise, resolve it with this one
        resolveRef = resolve;
        rejectRef = reject;
      } else {
        resolveRef = resolve;
        rejectRef = reject;
      }

      timeout = setTimeout(async () => {
        timeout = null;
        try {
          const result = await fn(...args);
          if (resolveRef) resolveRef(result);
        } catch (error) {
          if (rejectRef) rejectRef(error);
        }
      }, waitMs);
    });
  };
}

/**
 * Creates a memoized version of a promise-returning function
 * @param fn Function to memoize
 * @param getKey Function to generate cache key from arguments
 * @param ttlMs Optional time-to-live for cache entries in milliseconds
 * @returns Memoized function
 */
export function memoizePromise<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  getKey: (...args: Args) => string = (...args) => JSON.stringify(args),
  ttlMs?: number,
): (...args: Args) => Promise<T> {
  const cache = new Map<string, { value: T; timestamp: number }>();

  return async function (...args: Args): Promise<T> {
    const key = getKey(...args);
    const cached = cache.get(key);

    if (cached) {
      // If TTL is set, check if the cached value is still valid
      if (!ttlMs || Date.now() - cached.timestamp < ttlMs) {
        return cached.value;
      }
      // Otherwise, remove the expired item from cache
      cache.delete(key);
    }

    // Fetch and store the result
    const result = await fn(...args);
    cache.set(key, { value: result, timestamp: Date.now() });
    return result;
  };
}

/**
 * Breaks a collection into chunks and processes each chunk with the given function,
 * with a specified degree of parallelism
 * @param items Array of items to process
 * @param fn Function to process each chunk
 * @param chunkSize Size of each chunk to process
 * @param concurrency Maximum number of chunks to process in parallel
 * @returns Promise resolving to an array of results
 */
export async function chunkedProcess<T, R>(
  items: T[],
  fn: (chunk: T[]) => Promise<R>,
  chunkSize: number = 10,
  concurrency: number = 5,
): Promise<R[]> {
  // Create chunks
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += chunkSize) {
    chunks.push(items.slice(i, i + chunkSize));
  }

  const results: R[] = [];

  // Process chunks with limited concurrency
  for (let i = 0; i < chunks.length; i += concurrency) {
    const batch = chunks.slice(i, i + concurrency);
    const batchResults = await Promise.all(batch.map((chunk) => fn(chunk)));
    results.push(...batchResults);
  }

  return results;
}

/**
 * Creates a cancelable promise
 * @returns Object with promise and cancel function
 */
export function cancelable<T>(): {
  promise: Promise<T>;
  cancel: (reason?: string) => void;
} {
  let cancel: (reason?: string) => void = () => {};

  const promise = new Promise<T>((_, reject) => {
    cancel = (reason: string = "Promise was canceled") => {
      reject(new Error(reason));
    };
  });

  return {
    promise,
    cancel,
  };
}

/**
 * Creates a promise with a semaphore to limit concurrent executions
 * @param fn Function to wrap with semaphore
 * @param maxConcurrent Maximum number of concurrent executions
 * @returns Semaphore-wrapped function
 */
export function createSemaphore<T, Args extends any[]>(
  fn: (...args: Args) => Promise<T>,
  maxConcurrent: number = 5,
): (...args: Args) => Promise<T> {
  let running = 0;
  const queue: Array<() => void> = [];

  return async function (...args: Args): Promise<T> {
    // Wait for execution slot
    if (running >= maxConcurrent) {
      await new Promise<void>((resolve) => {
        queue.push(resolve);
      });
    }

    running++;

    try {
      // Execute the function
      return await fn(...args);
    } finally {
      running--;

      // Release next queued execution if any
      if (queue.length > 0) {
        const next = queue.shift();
        if (next) next();
      }
    }
  };
}
