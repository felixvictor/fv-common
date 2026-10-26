import { describe, expect, it } from "vitest"

import { isValidTimeZone } from "./time-zone.js"

describe("isValidTimeZone", () => {
    it("accepts IANA names and UTC offsets", () => {
        expect(isValidTimeZone("Europe/Berlin")).toBe(true)
        expect(isValidTimeZone("UTC")).toBe(true)
        expect(isValidTimeZone("+02:00")).toBe(true)
    })

    it("rejects unknown names and malformed offsets", () => {
        expect(isValidTimeZone("Europe/Atlantis")).toBe(false)
        expect(isValidTimeZone("+25:00")).toBe(false)
        expect(isValidTimeZone("")).toBe(false)
    })
})
