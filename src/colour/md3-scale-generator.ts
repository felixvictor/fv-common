import type { Md3ToneArray } from "@/colour/md3-tones"

import { ColourScaleGenerator } from "@/colour/colour-scale-generator"
import { blackHex, whiteHex } from "@/colour/constant"
import { maxTone, md3Tones, minTone, scaleNumberMax } from "@/colour/md3-tones"
import { okHslColour } from "@/colour/okhsl-colour"

export class Md3ScaleGenerator extends ColourScaleGenerator {
    static fromSeed(
        hex: string,
        backgroundY: number,
        chromaMinOffset: number,
        chromaMaxOffset: number,
    ): Md3ScaleGenerator {
        const seed = new okHslColour(hex)
        const minChroma = Math.max(0, seed.s - chromaMinOffset)
        const maxChroma = Math.min(1, seed.s + chromaMaxOffset)
        return new Md3ScaleGenerator(scaleNumberMax, seed.h, minChroma, maxChroma, backgroundY)
    }

    buildMd3Range = (): Md3ToneArray => md3Tones.map((tone) => this.colourAtScale(tone))

    colourAtScale = (scaleNumber: number): string => {
        if (scaleNumber <= minTone) return blackHex
        if (scaleNumber >= maxTone) return whiteHex
        return this.computeColour(scaleNumber).hex
    }
}
