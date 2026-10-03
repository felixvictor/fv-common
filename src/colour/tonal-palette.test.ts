import { describe, expect, it } from "vitest"

import { getColourDistance } from "./colour-distance.js"
import { getContrastRatio } from "./contrast.js"
import { hexToOklch } from "./oklch.js"
import { getRangeColour, paletteRangeTones } from "./palette-range.js"
import { TonalPalette } from "./tonal-palette.js"
import { getTone } from "./tone.js"

const hues = Array.from({ length: 12 }, (_, index) => index * 30)
const tones = [4, 10, 17, 30, 40, 50, 60, 80, 87, 90, 94, 98, 99]
/** Hex output has 8 bits per channel, which limits how exactly a tone can be hit. */
const toneTolerance = 0.5

describe("TonalPalette", () => {
    it.each(hues)("hits every tone exactly for hue %d", (hue) => {
        const palette = new TonalPalette(hue, 0.2)

        for (const tone of tones) expect(Math.abs(getTone(palette.tone(tone)) - tone)).toBeLessThan(toneTolerance)
    })

    it("returns pure black and white at the ends", () => {
        const palette = new TonalPalette(250, 0.1)

        expect(palette.tone(0)).toBe("#000000")
        expect(palette.tone(100)).toBe("#ffffff")
    })

    it("guarantees 4.5:1 for a tone difference of 50, whatever the hue", () => {
        for (const hue of hues) {
            const palette = new TonalPalette(hue, 0.2)

            expect(getContrastRatio(palette.tone(40), palette.tone(90))).toBeGreaterThanOrEqual(4.5)
            expect(getContrastRatio(palette.tone(30), palette.tone(80))).toBeGreaterThanOrEqual(4.5)
        }
    })

    it("keeps the hue of the seed", () => {
        const seed = "#3a6c9a"
        const palette = TonalPalette.fromHex(seed)

        expect(palette.hue).toBeCloseTo(hexToOklch(seed).hue, 6)
        expect(hexToOklch(palette.tone(40)).hue).toBeCloseTo(palette.hue, 0)
    })

    it("eases chroma towards the ends with a chroma floor below 1", () => {
        const constant = new TonalPalette(250, 0.05)
        const eased = new TonalPalette(250, 0.05, { chromaFloor: 0.5 })
        const chromaAt = (palette: TonalPalette, tone: number) => hexToOklch(palette.tone(tone)).chroma

        expect(Math.abs(chromaAt(constant, 30) - chromaAt(constant, 70))).toBeLessThan(0.003)
        expect(chromaAt(eased, 80)).toBeLessThan(chromaAt(eased, 50) - 0.01)
    })

    it("builds a range of distinguishable colours", () => {
        const range = new TonalPalette(0, 0.1).toneRange()
        const minDistance = 5

        expect(range).toHaveLength(paletteRangeTones.length)
        expect(getRangeColour(range, 38)).toBe(new TonalPalette(0, 0.1).tone(38))
        for (let index = 1; index < range.length; index++) {
            expect(getColourDistance(range[index - 1] ?? "", range[index] ?? "")).toBeGreaterThanOrEqual(minDistance)
        }
    })
})
