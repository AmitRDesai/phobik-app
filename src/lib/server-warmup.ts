import { env } from '@/utils/env';

const WARMUP_THROTTLE_MS = 30_000;
const WARMUP_TIMEOUT_MS = 25_000;

let lastWarmupAt = 0;
let inflight: Promise<void> | null = null;

/**
 * Fire-and-forget ping to /health to wake the backend Fly machine
 * before the user submits an auth request. Rate-limited so re-mounts
 * don't spam the endpoint, and never throws — this is a hint, not a
 * guarantee.
 */
export function warmServer(): Promise<void> {
  const now = Date.now();
  if (inflight) return inflight;
  if (now - lastWarmupAt < WARMUP_THROTTLE_MS) return Promise.resolve();
  lastWarmupAt = now;

  inflight = (async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), WARMUP_TIMEOUT_MS);
    try {
      const { fetch } = await import('expo/fetch');
      await fetch(`${env.get('API_URL')}/health`, {
        method: 'GET',
        signal: controller.signal,
        credentials: 'omit',
      });
    } catch {
      // Best-effort — staging cold-start may take longer than the timeout,
      // and a failed warmup is not user-facing.
    } finally {
      clearTimeout(timer);
      inflight = null;
    }
  })();

  return inflight;
}

export class ServerTimeoutError extends Error {
  constructor() {
    super("We couldn't reach the server in time. Please try again.");
    this.name = 'ServerTimeoutError';
  }
}

/**
 * Race a promise against a timeout. Used to bound auth requests so a
 * suspended backend can't leave the user staring at a spinner forever.
 */
export async function withTimeout<T>(
  fn: () => Promise<T>,
  timeoutMs: number,
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new ServerTimeoutError()), timeoutMs);
  });
  try {
    return await Promise.race([fn(), timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

function isRetryableError(err: unknown): boolean {
  if (err instanceof ServerTimeoutError) return true;
  if (err instanceof TypeError) {
    return err.message.toLowerCase().includes('network');
  }
  if (err instanceof Error) {
    const msg = err.message.toLowerCase();
    return (
      msg.includes('network request failed') ||
      msg.includes('failed to fetch') ||
      msg.includes('aborted')
    );
  }
  return false;
}

interface WithRetryOptions {
  timeoutMs?: number;
  retries?: number;
  retryDelayMs?: number;
}

/**
 * Wrap a network call with timeout + bounded retry. Retries only on
 * transient failures (timeout / network errors); auth failures from the
 * server are surfaced immediately.
 */
export async function withTimeoutAndRetry<T>(
  fn: () => Promise<T>,
  {
    timeoutMs = 30_000,
    retries = 1,
    retryDelayMs = 2_000,
  }: WithRetryOptions = {},
): Promise<T> {
  let attempt = 0;
  while (true) {
    try {
      return await withTimeout(fn, timeoutMs);
    } catch (err) {
      if (attempt >= retries || !isRetryableError(err)) throw err;
      attempt++;
      await new Promise((resolve) => setTimeout(resolve, retryDelayMs));
    }
  }
}
