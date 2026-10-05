import { describe, expect, it } from "vitest"

import { isBetweenTime, isDateInRange, isFutureDate, isPastDate } from "./compare.js"

const now = Temporal.Instant.from("2024-01-15T12:00:00Z")
const hourOffset = (hours: number): Date => new Date(now.epochMilliseconds + hours * 3_600_000)

describe("predicates", () => {
    it("isDateInRange (exclusive ends)", () => {
        expect(isDateInRange(hourOffset(1), 3, now)).toBe(true)
        expect(isDateInRange(hourOffset(3), 3, now)).toBe(false)
        expect(isDateInRange(hourOffset(-1), 3, now)).toBe(false)
        expect(isDateInRange(hourOffset(0.4), 0.5, now)).toBe(true)
    })

    it("isFutureDate", () => {
        expect(isFutureDate(hourOffset(1), now)).toBe(true)
        expect(isFutureDate("2024-01-15T13:30", now)).toBe(true)
        expect(isFutureDate("2024-01-15T12:30", now)).toBe(false)
        expect(isFutureDate("foo", now)).toBe(false)
    })

    it("isPastDate (inclusive)", () => {
        expect(isPastDate("2024-01-15 12:00", now)).toBe(true)
        expect(isPastDate("2024-01-15 12:01", now)).toBe(false)
        expect(isPastDate("foo", now)).toBe(false)
    })

    it("isBetweenTime compares the full local hour within (begin, end]", () => {
        const begin = Temporal.Instant.from("2024-01-15T09:00:00Z") // 10:00 Berlin
        const end = Temporal.Instant.from("2024-01-15T19:00:00Z") // 20:00 Berlin
        expect(isBetweenTime("2024-01-15 10:59", begin, end)).toBe(false)
        expect(isBetweenTime("2024-01-15 11:00", begin, end)).toBe(true)
        expect(isBetweenTime("2024-01-15 20:59", begin, end)).toBe(true)
        expect(isBetweenTime("2024-01-15 21:00", begin, end)).toBe(false)
        expect(isBetweenTime(undefined, begin, end)).toBe(false)
        expect(isBetweenTime("foo", begin, end)).toBe(false)
    })
})
