import { describe, expect, it } from "vitest"

import { getCurrentServerStart, getNextServerStart, getPreviousServerStart, getServerStart } from "./server-time.js"

const beforeMaintenance = Temporal.Instant.from("2024-01-15T08:00:00Z")

describe("server starts", () => {
    it("getServerStart counts from the most recent maintenance", () => {
        expect(getServerStart(0, beforeMaintenance).toInstant().toString()).toBe("2024-01-14T10:00:00Z")
        expect(getServerStart(0, Temporal.Instant.from("2024-01-15T10:00:00Z")).toInstant().toString()).toBe(
            "2024-01-15T10:00:00Z",
        )
    })

    it("named offsets", () => {
        expect(getPreviousServerStart(beforeMaintenance).toInstant().toString()).toBe("2024-01-13T10:00:00Z")
        expect(getCurrentServerStart(beforeMaintenance).toInstant().toString()).toBe("2024-01-14T10:00:00Z")
        expect(getNextServerStart(beforeMaintenance).toInstant().toString()).toBe("2024-01-15T10:00:00Z")
    })

    it("returns UTC date-times", () => {
        expect(getCurrentServerStart().timeZoneId).toBe("UTC")
    })
})
