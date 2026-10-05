import { afterEach, describe, expect, it, vi } from "vitest"

import { okLchColour } from "./oklch-colour.js"

describe("okLchColour", () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it("matches the OKLab reference values of sRGB red", () => {
        const { chroma, hue, lightness } = new okLchColour("#ff0000")

        expect(lightness).toBeCloseTo(0.628, 3)
        expect(chroma).toBeCloseTo(0.2577, 3)
        expect(hue).toBeCloseTo(29.23, 1)
    })

    it.each(["#000000", "#ffffff", "#3a6c9a", "#b3261e", "#14732a", "#8a5800"])("round-trips %s", (hex) => {
        expect(new okLchColour(hex).hex).toBe(hex)
    })

    it.each(["#000000", "#777777", "#fff"])("gives the grey %s chroma 0 and hue 0", (hex) => {
        const { chroma, hue } = new okLchColour(hex)

        expect(chroma).toBe(0)
        expect(hue).toBe(0)
    })

    it("keeps the hue of the faintest 8-bit tint", () => {
        expect(new okLchColour("#777778").chroma).toBeGreaterThan(0)
    })

    it("builds a colour from coordinates", () => {
        const colour = new okLchColour([0.5, 0.1, 250])

        expect(colour.lightness).toBe(0.5)
        expect(colour.chroma).toBe(0.1)
        expect(colour.hue).toBe(250)
    })

    it("maps into sRGB by reducing chroma, keeping lightness and hue", () => {
        const colour = new okLchColour([0.6, 0.4, 145])
        const mapped = colour.toGamut()

        expect(colour.isInGamut).toBe(false)
        expect(mapped.isInGamut).toBe(true)
        expect(mapped.lightness).toBeCloseTo(colour.lightness, 4)
        expect(mapped.hue).toBeCloseTo(colour.hue, 2)
        expect(mapped.chroma).toBeLessThan(colour.chroma)
    })

    it("measures the tone as CIE L*", () => {
        expect(new okLchColour("#777777").tone).toBeCloseTo(50, 0)
        expect(new okLchColour("#ffffff").tone).toBeCloseTo(100, 6)
    })

    it("normalises and clamps set values", () => {
        const colour = new okLchColour([0.5, 0.1, 250])
        colour.hue = -30
        colour.lightness = 2
        colour.chroma = -1

        expect(colour.hue).toBe(330)
        expect(colour.lightness).toBe(1)
        expect(colour.chroma).toBe(0)
    })

    it("keeps the value and warns on invalid input", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined)
        const colour = new okLchColour([0.5, 0.1, 250])
        colour.hue = "abc"

        expect(colour.hue).toBe(250)
        expect(warn).toHaveBeenCalledOnce()
    })

    it("takes the shorter way round between hues", () => {
        expect(okLchColour.hueDifference(350, 10)).toBeCloseTo(20)
        expect(okLchColour.hueDifference(10, 350)).toBeCloseTo(-20)
        expect(okLchColour.hueDifference(0, 180)).toBeCloseTo(180)
        expect(okLchColour.hueDistance(new okLchColour([0.5, 0.1, 350]), new okLchColour([0.5, 0.1, 10]))).toBeCloseTo(
            20,
        )
    })
})
