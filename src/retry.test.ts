import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { fibonacciSequence, retry, RetryError, type RetryInfo } from "./retry.js"

describe("fibonacciSequence", () => {
    it("starts with both seeds and continues with their sums", () => {
        const sequence = fibonacciSequence(3, 5)
        expect(Array.from({ length: 6 }, () => sequence.next().value)).toEqual([3, 5, 8, 13, 21, 34])
    })
})

describe("retry", () => {
    beforeEach(() => {
        vi.useFakeTimers()
    })

    afterEach(() => {
        vi.useRealTimers()
    })

    it("resolves without waiting if the first attempt succeeds", async () => {
        const operation = vi.fn(async () => "ok")

        await expect(retry(operation)).resolves.toBe("ok")
        expect(operation).toHaveBeenCalledOnce()
        expect(operation).toHaveBeenCalledWith(1)
    })

    it("retries with Fibonacci backoff until an attempt succeeds", async () => {
        const operation = vi
            .fn<(attempt: number) => Promise<string>>()
            .mockRejectedValueOnce(new Error("first"))
            .mockRejectedValueOnce(new Error("second"))
            .mockResolvedValue("ok")
        const onRetry = vi.fn<(info: RetryInfo) => void>()

        const result = retry(operation, { backoff: [1_000, 2_000], maxAttempts: 3, onRetry })
        await vi.advanceTimersByTimeAsync(1_000)
        expect(operation).toHaveBeenCalledTimes(2)
        await vi.advanceTimersByTimeAsync(2_000)

        await expect(result).resolves.toBe("ok")
        expect(operation).toHaveBeenCalledTimes(3)
        expect(onRetry.mock.calls.map(([info]) => [info.attempt, info.delay])).toEqual([
            [1, 1_000],
            [2, 2_000],
        ])
    })

    it("rejects with a RetryError carrying the last error once all attempts failed", async () => {
        const lastError = new Error("last")
        const operation = vi
            .fn<() => Promise<never>>()
            .mockRejectedValueOnce(new Error("first"))
            .mockRejectedValueOnce(lastError)

        const result = retry(operation, { backoff: [10, 20], maxAttempts: 2 })
        const assertion = expect(result).rejects.toMatchObject({ attempts: 2, cause: lastError, name: "RetryError" })
        await vi.runAllTimersAsync()

        await assertion
        await expect(result).rejects.toBeInstanceOf(RetryError)
    })

    it("rethrows errors rejected by shouldRetry unchanged", async () => {
        const error = new TypeError("permanent")
        const operation = vi.fn(async () => {
            throw error
        })

        await expect(retry(operation, { shouldRetry: (reason) => !(reason instanceof TypeError) })).rejects.toBe(error)
        expect(operation).toHaveBeenCalledOnce()
    })

    it("stops before the next attempt once the signal is aborted during the wait", async () => {
        const controller = new AbortController()
        const operation = vi.fn(async () => {
            throw new Error("transient")
        })

        const result = retry(operation, { backoff: [1_000, 1_000], signal: controller.signal })
        const assertion = expect(result).rejects.toThrow("aborted")
        await vi.advanceTimersByTimeAsync(0)
        controller.abort()
        await vi.runAllTimersAsync()

        await assertion
        expect(operation).toHaveBeenCalledOnce()
    })

    it("rejects an invalid maxAttempts", async () => {
        await expect(retry(async () => "ok", { maxAttempts: 0 })).rejects.toBeInstanceOf(RangeError)
    })
})
