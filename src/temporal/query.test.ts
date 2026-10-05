import { describe, expect, it } from "vitest"

import { closestDateIndex } from "./query.js"

const now = Temporal.Instant.from("2024-01-15T12:00:00Z")

describe("closestDateIndex", () => {
    it("finds the closest date and resolves ties to the first", () => {
        expect(closestDateIndex(["2024-01-15T10:00", "2024-01-15T14:00", "2024-01-17"], now)).toBe(1)
        expect(closestDateIndex(["2024-01-15T12:00:00Z", "2024-01-15T13:00"], now)).toBe(0)
    })

    it("skips unparsable entries", () => {
        expect(closestDateIndex(["foo", "2024-01-20"], now)).toBe(1)
        expect(closestDateIndex(["foo"], now)).toBeUndefined()
        expect(closestDateIndex([], now)).toBeUndefined()
    })
})
