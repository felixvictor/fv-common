import type { Coords } from "colorjs.io"

import {
    applyToeCurve,
    backgroundLightnessThreshold,
    chromaCurveFactor,
    hueShiftFactor,
    lightnessContrastExponentDark,
    lightnessContrastExponentLight,
    lightnessContrastOffset,
    yToLightness,
} from "./colour-math"
import { okHslColour } from "./okhsl-colour.js"

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

    computeColour(scaleNumber: number): okHslColour {
        const scaleValue = this.#normalizeScaleNumber(scaleNumber)

        const lightness = this.#computeScaleLightness(scaleValue)
        const hue = this.#computeScaleHue(scaleValue)
        const chroma = this.#computeScaleChroma(scaleValue)

        const coords: Coords = [hue, chroma, lightness]
        return new okHslColour(coords)
    }

    #computeScaleChroma(scaleValue: number): number {
        const chromaDifference = this.#maxChroma - this.#minChroma
        const parabolaFactor = -chromaCurveFactor * chromaDifference
        const linearFactor = chromaCurveFactor * chromaDifference

        return parabolaFactor * Math.pow(scaleValue, 2) + linearFactor * scaleValue + this.#minChroma
    }

    #computeScaleHue(scaleValue: number): number {
        return this.#baseHue + hueShiftFactor * (1 - scaleValue)
    }

    #computeScaleLightness(scaleValue: number): number {
        const isLightBackground = this.#backgroundY > backgroundLightnessThreshold

        const adjustedScaleValue = isLightBackground ? 1 - scaleValue : scaleValue
        const activeExponent = isLightBackground ? lightnessContrastExponentLight : lightnessContrastExponentDark

        const exponentialTerm = Math.exp(activeExponent * adjustedScaleValue)
        const adjustedBackground = this.#backgroundY + lightnessContrastOffset

        const foregroundY =
            (isLightBackground ? adjustedBackground / exponentialTerm : exponentialTerm * adjustedBackground) -
            lightnessContrastOffset

        return applyToeCurve(yToLightness(foregroundY))
    }

    #normalizeScaleNumber(scaleNumber: number): number {
        return scaleNumber / this.#maxScaleNumber
    }
}
