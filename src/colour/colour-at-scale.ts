import type { Coords } from "colorjs.io"

import { clamp } from "../common.js"
import { ColourMath } from "./colour-math.js"
import { HslColour } from "./hsl-colour.js"

/**
 * {@link https://matthewstrom.com/writing/generating-color-palettes/}
 *
 * Utility class for perceptually-designed HSL color scale generation.
 * Based on Matthew Ström's color palette generation algorithm.
 */

export class ColourScaleGenerator {
    readonly #backgroundY: number
    readonly #baseHue: number
    readonly #maxChroma: number
    readonly #maxScaleNumber: number
    readonly #minChroma: number

    constructor(maxScaleNumber: number, baseHue: number, minChroma: number, maxChroma: number, backgroundY: number) {
        this.#maxScaleNumber = maxScaleNumber
        this.#baseHue = baseHue
        this.#minChroma = minChroma
        this.#maxChroma = maxChroma
        this.#backgroundY = backgroundY
    }

    computeColour(scaleNumber: number): HslColour {
        const scaleValue = this.#normalizeScaleNumber(scaleNumber)

        const rawLightness = this.#computeScaleLightness(scaleValue)
        const normalizedLightness = clamp(
            rawLightness / ColourMath.lightnessScaleFactor,
            ColourMath.lightnessMin,
            ColourMath.lightnessMax,
        )

        const hue = this.#computeScaleHue(scaleValue)
        const chroma = this.#computeScaleChroma(scaleValue)

        const coords: Coords = [hue, chroma, normalizedLightness]
        return new HslColour(coords)
    }

    #computeScaleChroma(scaleValue: number): number {
        const chromaDifference = this.#maxChroma - this.#minChroma
        const parabolaFactor = -ColourMath.chromaCurveFactor * chromaDifference
        const linearFactor = ColourMath.chromaCurveFactor * chromaDifference

        return parabolaFactor * Math.pow(scaleValue, 2) + linearFactor * scaleValue + this.#minChroma
    }

    #computeScaleHue(scaleValue: number): number {
        return this.#baseHue + ColourMath.hueShiftFactor * (1 - scaleValue)
    }

    #computeScaleLightness(scaleValue: number): number {
        const exponentialTerm = Math.exp(ColourMath.lightnessContrastExponent * scaleValue)
        const adjustedBackground = this.#backgroundY + ColourMath.lightnessContrastOffset

        const foregroundY =
            this.#backgroundY > ColourMath.backgroundLightnessThreshold
                ? adjustedBackground / exponentialTerm - ColourMath.lightnessContrastOffset
                : exponentialTerm * adjustedBackground - ColourMath.lightnessContrastOffset

        return ColourMath.applyToeCurve(ColourMath.yToLightness(foregroundY))
    }

    #normalizeScaleNumber(scaleNumber: number): number {
        return scaleNumber / this.#maxScaleNumber
    }
}
