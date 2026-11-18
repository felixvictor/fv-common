import { describe, expect, it } from "vitest"

import { isPercentage } from "./guard.js"

describe("isPercentage", () => {
    it("accepts numbers from 0 to 100 inclusive", () => {
        expect(isPercentage(0)).toBe(true)
        expect(isPercentage(42.5)).toBe(true)
        expect(isPercentage(100)).toBe(true)
    })

    it("rejects numbers outside the range, NaN and infinite values", () => {
        expect(isPercentage(-0.1)).toBe(false)
        expect(isPercentage(100.1)).toBe(false)
        expect(isPercentage(Number.NaN)).toBe(false)
        expect(isPercentage(Number.POSITIVE_INFINITY)).toBe(false)
    })

    it("does not coerce non-numbers", () => {
        expect(isPercentage("50")).toBe(false)
        expect(isPercentage(null)).toBe(false)
        expect(isPercentage(undefined)).toBe(false)
        expect(isPercentage(true)).toBe(false)
    })
})
