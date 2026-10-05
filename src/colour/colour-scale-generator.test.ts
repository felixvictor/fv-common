import { describe, expect, it } from "vitest"

import { ColourScaleGenerator } from "./colour-scale-generator.js"
import { okLchColour } from "./oklch-colour.js"

const scaleSteps = 12

describe("ColourScaleGenerator", () => {
    it("builds a scale on a light background from dark to light", () => {
        const generator = new ColourScaleGenerator(scaleSteps, 250, 0.2, 0.6, 0.9)
        const scale = Array.from({ length: scaleSteps + 1 }, (_, step) => generator.computeColour(step).hex)

        expect(scale).toEqual([
            "#222a34",
            "#28374a",
            "#2d4461",
            "#315279",
            "#376090",
            "#3e6fa7",
            "#497fbb",
            "#5a90cc",
            "#72a2d8",
            "#8fb5de",
            "#afc8e4",
            "#cfdcea",
            "#eff2f6",
        ])
    })

    it("builds a scale on a dark background from dark to light", () => {
        const generator = new ColourScaleGenerator(scaleSteps, 30, 0.1, 0.5, new okLchColour("#020202").luminance)
        const tones = Array.from({ length: scaleSteps + 1 }, (_, step) => generator.computeColour(step).colourObject)

        for (let step = 1; step < tones.length; step++) {
            expect(tones[step]?.luminance ?? 0).toBeGreaterThanOrEqual(tones[step - 1]?.luminance ?? 0)
        }
        expect(generator.computeColour(scaleSteps).hex).toBe("#fff")
    })
})
