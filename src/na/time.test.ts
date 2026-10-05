import { describe, expect, it } from "vitest"

import { getLastWeek, getPortBattleTime, getThisWeek, getToday, getYesterday, type ServerTimePeriod } from "./time.js"

const toStrings = ({ begin, end }: ServerTimePeriod): [string, string] => [
    begin.toInstant().toString(),
    end.toInstant().toString(),
]

// Wednesday
const afterMaintenance = Temporal.Instant.from("2024-01-17T12:00:00Z")
const beforeMaintenance = Temporal.Instant.from("2024-01-17T09:59:59Z")

describe("server days", () => {
    it("getToday", () => {
        expect(toStrings(getToday(afterMaintenance))).toEqual(["2024-01-17T10:00:00Z", "2024-01-18T10:00:00Z"])
        expect(toStrings(getToday(beforeMaintenance))).toEqual(["2024-01-16T10:00:00Z", "2024-01-17T10:00:00Z"])
    })

    it("getYesterday", () => {
        expect(toStrings(getYesterday(afterMaintenance))).toEqual(["2024-01-16T10:00:00Z", "2024-01-17T10:00:00Z"])
        expect(toStrings(getYesterday(beforeMaintenance))).toEqual(["2024-01-15T10:00:00Z", "2024-01-16T10:00:00Z"])
    })
})

describe("server weeks", () => {
    it("getThisWeek runs from Monday to Monday at maintenance hour", () => {
        expect(toStrings(getThisWeek(afterMaintenance))).toEqual(["2024-01-15T10:00:00Z", "2024-01-22T10:00:00Z"])
        expect(toStrings(getThisWeek(Temporal.Instant.from("2024-01-21T23:00:00Z")))).toEqual([
            "2024-01-15T10:00:00Z",
            "2024-01-22T10:00:00Z",
        ])
    })

    it("getLastWeek", () => {
        expect(toStrings(getLastWeek(afterMaintenance))).toEqual(["2024-01-08T10:00:00Z", "2024-01-15T10:00:00Z"])
    })
})

describe("getPortBattleTime", () => {
    it("formats UTC and local hour ranges", () => {
        expect(getPortBattleTime(0, false, "UTC")).toContain(">10\u00A0–\u00A08<")
        expect(getPortBattleTime(2, true, "UTC")).toContain(">12\u00A0–\u00A021<")
        expect(getPortBattleTime(13, true, "UTC")).toContain(">23\u00A0–\u00A08<")
    })
})
