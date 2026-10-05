import { describe, expect, it } from "vitest"

import {
    convertBerlinTimeToUTC,
    convertDate,
    convertDEDateString,
    convertUTCStringToDate,
    getLocalHour,
    getRange,
    parseInstant,
    parseUtcDateTime,
    toInstant,
    toZonedDateTime,
} from "./convert.js"

// System time zone is Europe/Berlin (vitest.config.ts)

describe("toInstant", () => {
    it("reads strings without offset as wall-clock time", () => {
        expect(toInstant("2024-01-15T14:30").toString()).toBe("2024-01-15T13:30:00Z")
        expect(toInstant("2024-01-15 14:30", "UTC").toString()).toBe("2024-01-15T14:30:00Z")
        expect(toInstant("2024-01-15").toString()).toBe("2024-01-14T23:00:00Z")
    })

    it("keeps explicit offsets", () => {
        expect(toInstant("2024-01-15T14:30:00+05:00", "UTC").toString()).toBe("2024-01-15T09:30:00Z")
    })

    it("accepts Date, epoch milliseconds and instants", () => {
        const instant = Temporal.Instant.from("2024-01-15T13:30:00Z")
        expect(toInstant(new Date(instant.epochMilliseconds)).equals(instant)).toBe(true)
        expect(toInstant(instant.epochMilliseconds).equals(instant)).toBe(true)
        expect(toInstant(instant)).toBe(instant)
    })

    it("throws or returns undefined for invalid input", () => {
        expect(() => toInstant("foo")).toThrow(RangeError)
        expect(parseInstant("foo")).toBeUndefined()
        expect(parseInstant(new Date(Number.NaN))).toBeUndefined()
    })

    it("converts to a date-time in the requested time zone", () => {
        expect(toZonedDateTime("2024-01-15T13:30:00Z", "Asia/Kolkata").toPlainTime().toString()).toBe("19:00:00")
    })
})

describe("parseUtcDateTime", () => {
    it("parses the datetime layout as UTC", () => {
        expect(parseUtcDateTime("2024-01-15 10:00")?.toInstant().toString()).toBe("2024-01-15T10:00:00Z")
        expect(parseUtcDateTime("foo")).toBeUndefined()
    })
})

describe("legacy conversions", () => {
    it("convertDEDateString", () => {
        expect(convertDEDateString("15.01.2024 10:30")).toBe("2024-01-15T09:30:00.000Z")
        expect(convertDEDateString("27.10.2024 02:30")).toBe("2024-10-27T00:30:00.000Z")
        expect(() => convertDEDateString("5.1.2024 10:30")).toThrow(RangeError)
        expect(() => convertDEDateString("31.03.2024 02:30")).toThrow(RangeError)
    })

    it("convertUTCStringToDate", () => {
        expect(convertUTCStringToDate("2024-01-15 10:00").toISOString()).toBe("2024-01-15T10:00:00.000Z")
        expect(convertUTCStringToDate("2024-01-15T10:00:00+01:00").toISOString()).toBe("2024-01-15T09:00:00.000Z")
    })

    it("convertBerlinTimeToUTC", () => {
        expect(convertBerlinTimeToUTC("2024-07-01 12:00").toISOString()).toBe("2024-07-01T10:00:00.000Z")
        expect(convertBerlinTimeToUTC("2024-01-15T13:30:00Z").toISOString()).toBe("2024-01-15T13:30:00.000Z")
    })

    it("convertDate", () => {
        expect(convertDate("15.01.2024", "DD.MM.YYYY", "D. MMMM YYYY", "de")).toBe("15. Januar 2024")
        expect(convertDate("15 January 2024", "D MMMM YYYY", "YYYY-MM-DD", "en")).toBe("2024-01-15")
        expect(convertDate("foo", "YYYY-MM-DD", "YYYY", "en")).toBeUndefined()
    })

    it("getLocalHour", () => {
        const today = Temporal.Now.plainDateISO("UTC")
        const expectedBerlinHour = today
            .toZonedDateTime({ plainTime: "10:00", timeZone: "UTC" })
            .withTimeZone("Europe/Berlin").hour
        expect(getLocalHour(10)).toBe(expectedBerlinHour)
        expect(getLocalHour(10, "UTC")).toBe(10)
        expect(getLocalHour(0, "Asia/Kolkata")).toBe(5)
        expect(getLocalHour(24, "UTC")).toBe(0)
    })

    it("getRange", () => {
        const dates = [
            new Date("2024-01-01T00:00:00Z"),
            new Date("2024-01-15T00:00:00Z"),
            new Date("2024-01-31T00:00:00Z"),
        ]
        const { begin, end } = getRange(dates)
        expect(begin.toString()).toBe("2024-01-01T00:00:00Z")
        expect(end.toString()).toBe("2024-01-31T00:00:00Z")
    })
})
