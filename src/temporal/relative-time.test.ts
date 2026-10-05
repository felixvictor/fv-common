import { describe, expect, it } from "vitest"

import { formatRelativeTime, getDateDistance, getRelativeTime } from "./relative-time.js"

const now = Temporal.Instant.from("2024-06-15T12:00:00Z")
const secondsFromNow = (seconds: number): Temporal.ZonedDateTime =>
    now.add({ seconds }).toZonedDateTimeISO("Europe/Berlin")

describe("formatRelativeTime", () => {
    it.each([
        [-30, "now"],
        [-50, "1 minute ago"],
        [-100, "2 minutes ago"],
        [-3_600, "1 hour ago"],
        [-18_000, "5 hours ago"],
        [-108_000, "1 day ago"],
        [-259_200, "3 days ago"],
        [-2_592_000, "1 month ago"],
        [-34_560_000, "1 year ago"],
        [7_200, "in 2 hours"],
    ])("%i s -> %s", (seconds, expected) => {
        expect(formatRelativeTime(secondsFromNow(seconds), "en", now)).toBe(expected)
    })

    it("uses the locale", () => {
        expect(formatRelativeTime(secondsFromNow(-7_200), "de", now)).toBe("vor 2 Stunden")
    })
})

describe("string variants", () => {
    it("getDateDistance reads local time", () => {
        expect(getDateDistance("2024-06-15T12:00", "en", now)).toBe("2 hours ago")
    })

    it("getRelativeTime reads UTC", () => {
        expect(getRelativeTime("2024-06-15 10:00", "en", now)).toBe("2 hours ago")
        expect(() => getRelativeTime("foo", "en", now)).toThrow(RangeError)
    })
})
