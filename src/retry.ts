import { delay } from "./delay.js"

/** Passed to {@link RetryOptions.onRetry} after a failed attempt, before waiting for the next one. */
export interface RetryInfo {
    /** Number of the attempt that just failed, starting at 1. */
    readonly attempt: number
    /** Wait in milliseconds before the next attempt. */
    readonly delay: number
    readonly error: unknown
    readonly maxAttempts: number
}

export interface RetryOptions {
    /**
     * First two waits in milliseconds; each further wait is the sum of the previous two (Fibonacci backoff). Default
     * `[3_000, 5_000]`, i.e. 3 s, 5 s, 8 s, 13 s, …
     */
    readonly backoff?: readonly [number, number]
    /** Total number of attempts including the first one; a positive integer. Default 3. */
    readonly maxAttempts?: number
    /** Called after each failed attempt that will be retried, e.g. for logging. */
    readonly onRetry?: (info: RetryInfo) => void
    /**
     * Decides whether an error is transient and worth another attempt. Default: every error. Errors for which it
     * returns false are rethrown unchanged.
     */
    readonly shouldRetry?: (error: unknown) => boolean
    /**
     * Cancels the operation: checked before every attempt, and an error thrown while it is aborted is never retried. A
     * running wait is not interrupted.
     */
    readonly signal?: AbortSignal
}

/** Thrown by {@link retry} once all attempts have failed; `cause` holds the error of the last attempt. */
export class RetryError extends Error {
    readonly attempts: number

    constructor(attempts: number, cause: unknown) {
        super(`All ${attempts} attempts failed: ${cause instanceof Error ? cause.message : String(cause)}`, { cause })
        this.name = "RetryError"
        this.attempts = attempts
    }
}

/** Lazily generates a Fibonacci-like sequence from two seeds: `first`, `second`, `first + second`, … */
export function* fibonacciSequence(first: number, second: number): Generator<number, never, undefined> {
    let [current, next] = [first, second]
    for (;;) {
        yield current
        ;[current, next] = [next, current + next]
    }
}

/**
 * Runs `operation` until it resolves, retrying failures with Fibonacci backoff (see {@link RetryOptions.backoff}).
 *
 * `operation` receives the attempt number (starting at 1). Create per-attempt resources inside it, e.g. a fresh
 * `AbortSignal.timeout()` for each request, and include response validation if an invalid body may be transient (such
 * as an HTML error page served instead of JSON).
 *
 * Rejects with a {@link RetryError} once `maxAttempts` attempts have failed, with the original error if `shouldRetry`
 * rejects it or `signal` is aborted, and with a `RangeError` if `maxAttempts` is not a positive integer.
 */
export const retry = async <T>(operation: (attempt: number) => Promise<T>, options: RetryOptions = {}): Promise<T> => {
    const { backoff = [3_000, 5_000], maxAttempts = 3, onRetry, shouldRetry = () => true, signal } = options
    if (!Number.isInteger(maxAttempts) || maxAttempts < 1) {
        throw new RangeError(`maxAttempts must be a positive integer, got ${maxAttempts}`)
    }

    const waits = fibonacciSequence(...backoff)
    for (let attempt = 1; ; attempt++) {
        signal?.throwIfAborted()
        try {
            return await operation(attempt)
        } catch (error) {
            if (signal?.aborted === true || !shouldRetry(error)) throw error
            if (attempt >= maxAttempts) throw new RetryError(attempt, error)

            const { value: wait } = waits.next()
            onRetry?.({ attempt, delay: wait, error, maxAttempts })
            await delay(wait)
        }
    }
}
