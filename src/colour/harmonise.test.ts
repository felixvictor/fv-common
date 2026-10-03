import { describe, expect, it } from "vitest"

import { harmoniseChroma, harmoniseHue, harmoniseOklch, noHarmonisation } from "./harmonise.js"

const md3Strength = { chromaFactor: 0.5, hueFactor: 0.5, maxHueRotation: 15, minHueDistance: 0 }

describe("harmoniseHue", () => {
    it("rotates by half the difference, at most 15° (MD3)", () => {
        expect(harmoniseHue(0, 20, md3Strength)).toBeCloseTo(10)
        expect(harmoniseHue(0, 100, md3Strength)).toBeCloseTo(15)
        expect(harmoniseHue(100, 0, md3Strength)).toBeCloseTo(85)
    })

    it("takes the shorter way across 0°", () => {
        expect(harmoniseHue(350, 10, md3Strength)).toBeCloseTo(0)
        expect(harmoniseHue(10, 350, md3Strength)).toBeCloseTo(0)
    })

    it("stops at the minimum hue distance", () => {
        const strength = { ...md3Strength, minHueDistance: 30 }

        expect(harmoniseHue(0, 40, strength)).toBeCloseTo(10)
        expect(harmoniseHue(0, 20, strength)).toBeCloseTo(0)
        expect(harmoniseHue(0, 100, strength)).toBeCloseTo(15)
    })

    it("leaves the hue unchanged without harmonisation", () => {
        expect(harmoniseHue(42, 250, noHarmonisation)).toBe(42)
    })
})

describe("harmoniseChroma", () => {
    it("lowers chroma above the target only", () => {
        expect(harmoniseChroma(0.2, 0.1, md3Strength)).toBeCloseTo(0.15)
        expect(harmoniseChroma(0.05, 0.1, md3Strength)).toBe(0.05)
    })
})

describe("harmoniseOklch", () => {
    it("keeps lightness", () => {
        const result = harmoniseOklch(
            { chroma: 0.2, hue: 0, lightness: 0.4 },
            { chroma: 0.1, hue: 20, lightness: 0.8 },
            md3Strength,
        )

        expect(result.lightness).toBe(0.4)
        expect(result.hue).toBeCloseTo(10)
    })
})
