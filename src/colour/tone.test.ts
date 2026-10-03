import { describe, expect, it } from "vitest"

import { getTone, luminanceToTone, toneToLuminance } from "./tone.js"

describe("tone", () => {
    it.each([0, 4, 8, 10, 40, 50, 87, 98, 100])("round-trips tone %d through luminance", (tone) => {
        expect(luminanceToTone(toneToLuminance(tone))).toBeCloseTo(tone, 6)
    })

    it("gives middle grey (CIE L* 50) a luminance of about 0.184", () => {
        expect(toneToLuminance(50)).toBeCloseTo(0.1842, 4)
    })

    it("measures black, white and mid grey", () => {
        expect(getTone("#000000")).toBe(0)
        expect(getTone("#ffffff")).toBeCloseTo(100, 6)
        expect(getTone("#777777")).toBeCloseTo(50, 0)
    })
})
