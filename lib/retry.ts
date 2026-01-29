/**
 * Utility functions for handling API requests with retry logic and backoff
 */

/**
 * Configuration for retry with exponential backoff
 */
export interface RetryConfig {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffFactor: number;
}

/**
 * Default retry configuration
 */
export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxRetries: 3,
  baseDelay: 1000, // 1 second
  maxDelay: 10000, // 10 seconds
  backoffFactor: 2,
};

/**
 * Sleep for a specified number of milliseconds
 * @param ms - Milliseconds to sleep
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Calculate exponential backoff delay
 * @param attempt - Current attempt number (0-based)
 * @param config - Retry configuration
 */
export function calculateBackoffDelay(attempt: number, config: RetryConfig): number {
  const delay = config.baseDelay * Math.pow(config.backoffFactor, attempt);
  return Math.min(delay, config.maxDelay);
}

/**
 * Execute a function with retry logic and exponential backoff
 * @param fn - Function to execute
 * @param config - Retry configuration
 * @param shouldRetry - Function to determine if error should be retried
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  config: RetryConfig = DEFAULT_RETRY_CONFIG,
  shouldRetry?: (error: unknown) => boolean
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt <= config.maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      // Don't retry on last attempt or if shouldRetry returns false
      if (attempt === config.maxRetries ||
          (shouldRetry && !shouldRetry(error))) {
        throw error;
      }

      // Calculate delay and wait
      const delay = calculateBackoffDelay(attempt, config);
      await sleep(delay);
    }
  }

  throw lastError;
}

/**
 * Check if an error is retryable (network errors, 5xx status codes)
 * @param error - The error to check
 */
export function isRetryableError(error: unknown): boolean {
  if (error instanceof Response) {
    // HTTP response errors
    const status = error.status;
    return status >= 500 || status === 429; // Server errors or rate limit
  }

  if (error instanceof TypeError && error.message.includes('fetch')) {
    // Network errors
    return true;
  }

  return false;
}

/**
 * Fetch with retry logic for API calls
 * @param url - URL to fetch
 * @param options - Fetch options
 * @param retryConfig - Retry configuration
 */
export async function fetchWithRetry(
  url: string,
  options?: RequestInit,
  retryConfig: RetryConfig = DEFAULT_RETRY_CONFIG
): Promise<Response> {
  return withRetry(
    () => fetch(url, options),
    retryConfig,
    isRetryableError
  );
}