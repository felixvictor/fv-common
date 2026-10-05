import { describe, expect, it } from "vitest"

import { simulateVisionDeficiency, visionDeficiencies } from "./vision-deficiency.js"

describe("simulateVisionDeficiency", () => {
    it.each(visionDeficiencies)("keeps achromatic colours for %s", (deficiency) => {
        expect(simulateVisionDeficiency("#777777", deficiency)).toBe("#777")
        expect(simulateVisionDeficiency("#ffffff", deficiency)).toBe("#fff")
    })

    it("simulates the confusion of red and green", () => {
        expect(simulateVisionDeficiency("#ff0000", "deuteranopia")).toBe("#a39000")
        expect(simulateVisionDeficiency("#00ff00", "deuteranopia")).toBe("#efd63a")
        expect(simulateVisionDeficiency("#ff0000", "protanopia")).toBe("#6d5f00")
    })

    it("clips results outside sRGB", () => {
        expect(simulateVisionDeficiency("#ff0000", "tritanopia")).toBe("#ff000f")
    })
})
