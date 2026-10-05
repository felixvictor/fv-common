import { describe, expect, it } from "vitest"

import { getInstantFromTicks, getTicksFromDate, getTimeFromTicks, getTimestampFromTicks } from "./ticks.js"

const ticks = 638_409_260_451_234_567n // 2024-01-15T14:34:05.1234567Z

describe(".NET ticks", () => {
    it("converts ticks to milliseconds, strings and instants", () => {
        expect(getTimestampFromTicks(ticks)).toBe(Date.UTC(2024, 0, 15, 14, 34, 5, 123))
        expect(getTimestampFromTicks(String(ticks))).toBe(Date.UTC(2024, 0, 15, 14, 34, 5, 123))
        expect(getTimeFromTicks(ticks)).toBe("2024-01-15 14:34")
        expect(getInstantFromTicks(ticks).toString()).toBe("2024-01-15T14:34:05.1234567Z")
    })

    it("converts points in time to ticks", () => {
        expect(getTicksFromDate(getInstantFromTicks(ticks))).toBe(ticks)
        expect(getTicksFromDate(Date.UTC(2024, 0, 15, 14, 34, 5, 123))).toBe(638_409_260_451_230_000n)
        expect(getTicksFromDate(new Date(0))).toBe(621_355_968_000_000_000n)
    })
})
