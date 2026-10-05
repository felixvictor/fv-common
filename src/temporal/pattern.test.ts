import { describe, expect, it } from "vitest"

import { formatPattern, parsePattern } from "./pattern.js"

const dateTime = Temporal.PlainDateTime.from("2024-01-15T14:05:09.042")

describe("formatPattern", () => {
    it("formats numeric tokens", () => {
        expect(formatPattern(dateTime, "YYYY-MM-DD HH:mm:ss.SSS")).toBe("2024-01-15 14:05:09.042")
        expect(formatPattern(dateTime, "YY M D H m s")).toBe("24 1 15 14 5 9")
        expect(formatPattern(dateTime, "h hh A a d")).toBe("2 02 PM pm 1")
    })

    it("formats localised names", () => {
        expect(formatPattern(dateTime, "dddd, D. MMMM, H.mm", "de")).toBe("Montag, 15. Januar, 14.05")
        expect(formatPattern(dateTime, "ddd D MMM", "en-GB")).toBe("Mon 15 Jan")
        expect(formatPattern(dateTime, "dddd D MMMM", "en")).toBe("Monday 15 January")
    })

    it("formats a ZonedDateTime in its own time zone", () => {
        const zoned = Temporal.Instant.from("2024-01-15T13:30:00Z").toZonedDateTimeISO("Europe/Berlin")
        expect(formatPattern(zoned, "H:mm")).toBe("14:30")
    })

    it("emits escaped text and literals verbatim", () => {
        expect(formatPattern(dateTime, "[Today is] D.M., [YYYY]")).toBe("Today is 15.1., YYYY")
    })

    it("rejects unsupported tokens", () => {
        expect(() => formatPattern(dateTime, "dd")).toThrow(RangeError)
        expect(() => formatPattern(dateTime, "HH:mm Z")).toThrow(RangeError)
    })
})

describe("parsePattern", () => {
    it("parses numeric tokens", () => {
        expect(parsePattern("15.01.2024 14:30", "DD.MM.YYYY HH:mm")?.toString()).toBe("2024-01-15T14:30:00")
        expect(parsePattern("2024-1-5 9:05", "YYYY-M-D H:mm")?.toString()).toBe("2024-01-05T09:05:00")
        expect(parsePattern("2024-01-15 14:30:45.123", "YYYY-MM-DD HH:mm:ss.SSS")?.toString()).toBe(
            "2024-01-15T14:30:45.123",
        )
    })

    it("parses two-digit years with pivot 68", () => {
        expect(parsePattern("3/7/24", "M/D/YY")?.year).toBe(2024)
        expect(parsePattern("3/7/69", "M/D/YY")?.year).toBe(1969)
    })

    it("parses month names case-insensitively", () => {
        expect(parsePattern("15. januar 2024", "D. MMMM YYYY", { locale: "de" })?.month).toBe(1)
        expect(parsePattern("15 Mar 2024", "D MMM YYYY", { locale: "en" })?.month).toBe(3)
    })

    it("defaults missing date parts to the current date", () => {
        const today = Temporal.Now.plainDateISO()
        expect(parsePattern("14:30", "HH:mm")?.toPlainDate().equals(today)).toBe(true)
        expect(parsePattern("2024", "YYYY")?.toString()).toBe("2024-01-01T00:00:00")
    })

    it("returns undefined for mismatching or out-of-range input", () => {
        expect(parsePattern("foo", "YYYY-MM-DD")).toBeUndefined()
        expect(parsePattern("2024-13-01", "YYYY-MM-DD")).toBeUndefined()
        expect(parsePattern("2024-02-30", "YYYY-MM-DD")).toBeUndefined()
    })

    it("requires an exact round trip in strict mode", () => {
        expect(parsePattern("5.1.2024 10:30", "DD.MM.YYYY HH:mm", { isStrict: true })).toBeUndefined()
        expect(parsePattern("05.01.2024 10:30", "DD.MM.YYYY HH:mm", { isStrict: true })?.day).toBe(5)
    })

    it("rejects tokens that cannot be parsed", () => {
        expect(() => parsePattern("Monday", "dddd")).toThrow(RangeError)
    })
})
