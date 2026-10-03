import { describe, expect, it } from "vitest"

import {
    getHueDifference,
    hexToOklch,
    isInSrgbGamut,
    linearRgbToOklch,
    mapOklchToSrgb,
    oklchToHex,
    oklchToLinearRgb,
} from "./oklch.js"

describe("hexToOklch", () => {
    it("matches the OKLab reference values of sRGB red", () => {
        const { chroma, hue, lightness } = hexToOklch("#ff0000")

        expect(lightness).toBeCloseTo(0.628, 3)
        expect(chroma).toBeCloseTo(0.2577, 3)
        expect(hue).toBeCloseTo(29.23, 1)
    })

    it.each(["#000000", "#ffffff", "#3a6c9a", "#b3261e", "#14732a", "#8a5800"])("round-trips %s", (hex) => {
        expect(oklchToHex(hexToOklch(hex))).toBe(hex)
    })
})

describe("getHueDifference", () => {
    it("takes the shorter way round", () => {
        expect(getHueDifference(350, 10)).toBeCloseTo(20)
        expect(getHueDifference(10, 350)).toBeCloseTo(-20)
        expect(getHueDifference(0, 180)).toBeCloseTo(180)
    })
})

describe("mapOklchToSrgb", () => {
    it("reduces chroma only as far as needed and keeps the hue", () => {
        const colour = { chroma: 0.4, hue: 145, lightness: 0.6 }

        expect(isInSrgbGamut(oklchToLinearRgb(colour))).toBe(false)

        const mapped = mapOklchToSrgb(colour)
        const { chroma, hue, lightness } = linearRgbToOklch(mapped)

        expect(isInSrgbGamut(mapped)).toBe(true)
        expect(lightness).toBeCloseTo(colour.lightness, 4)
        expect(hue).toBeCloseTo(colour.hue, 2)
        expect(chroma).toBeLessThan(colour.chroma)
        expect(isInSrgbGamut(oklchToLinearRgb({ ...colour, chroma: chroma + 0.001 }))).toBe(false)
    })
})
