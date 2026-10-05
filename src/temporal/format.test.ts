import { describe, expect, it } from "vitest"

import { cSpaceNoBreak } from "../unicode.js"
import {
    formatDate,
    formatDateString,
    formatDateViaDayjs,
    formatLocalDate,
    formatLocalTime,
    formatTime,
    formatTimeRange,
    formatUtcDateTime,
    getFormattedDate,
    getFormattedDateShort,
    getFormattedDateShortSeconds,
    getFormattedShortDateFromUTC,
} from "./format.js"

// System time zone is Europe/Berlin (vitest.config.ts)

describe("legacy formats", () => {
    it("getFormattedDate", () => {
        expect(getFormattedDate("2024-01-15T14:30", "de")).toBe(`Montag, 15.${cSpaceNoBreak}Januar, 14.30`)
        expect(getFormattedDate("2024-01-15T13:30:00Z", "en")).toBe(`Monday, 15.${cSpaceNoBreak}January, 14.30`)
    })

    it("getFormattedDateShort", () => {
        expect(getFormattedDateShort("2024-01-15T14:30")).toBe("15.1. 14.30")
        expect(getFormattedDateShort(Date.UTC(2024, 0, 15, 13, 30))).toBe("15.1. 14.30")
    })

    it("getFormattedShortDateFromUTC", () => {
        expect(getFormattedShortDateFromUTC("2024-01-15 13:30", "de")).toBe("15. Januar, 14.30")
        expect(getFormattedShortDateFromUTC(new Date("2024-07-15T13:30:00Z"), "de")).toBe("15. Juli, 15.30")
    })

    it("getFormattedDateShortSeconds", () => {
        expect(getFormattedDateShortSeconds("2024-01-15T14:30:45", "de")).toBe("15. Januar 14.30.45")
    })

    it("UTC datetime strings", () => {
        expect(formatUtcDateTime("2024-01-15 9:05")).toBe("2024-01-15 09:05")
        expect(formatDateViaDayjs("2024-01-15 10:00")).toBe("2024-01-15 10:00")
        expect(formatTime("2024-01-15 10:30")).toBe("10:30")
        expect(formatLocalDate("2024-01-15 23:30")).toBe("2024-01-16 00:30")
        expect(formatLocalTime("2024-07-15 10:00")).toBe("12:00")
        expect(formatLocalTime("2024-07-15 10:00", "America/New_York")).toBe("6:00")
        expect(() => formatTime("foo")).toThrow(RangeError)
    })

    it("formatTimeRange", () => {
        expect(formatTimeRange(10, 12, "UTC")).toBe(
            `<span class="text-no-wrap">10${cSpaceNoBreak}–${cSpaceNoBreak}12</span> (<span class="text-no-wrap">10${cSpaceNoBreak}–${cSpaceNoBreak}12</span>${cSpaceNoBreak}local)`,
        )
    })
})

describe("date formats", () => {
    it("default to the short date style", () => {
        expect(formatDate(new Date(2024, 0, 15), undefined, "de")).toBe("15.01.24")
        expect(formatDateString("2024-01-15", undefined, "en-GB")).toBe("15/01/2024")
    })
})
