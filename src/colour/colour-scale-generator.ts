import { clamp } from "@/common"
import Color, { type Coords } from "colorjs.io"

import { okHslColour } from "./okhsl-colour.js"

const greySpace = "srgb"
const whiteCoords: Coords = [1, 1, 1]
const oklabSpace = "oklab"
const cieLightnessCoordinate = "lab-d65.l"
const cieLightnessMax = 100
const luminanceMin = 0
const luminanceMax = 1

/**
 * {@link https://matthewstrom.com/writing/generating-color-palettes/}
 *
 * Perceptual colour scale in OKHSL after Matthew Ström: each step has a fixed contrast to the background, chroma
 * follows a parabola peaking mid-scale, and hue shifts slightly towards the light end.
 */
export class ColourScaleGenerator {
    /** Background luminance above which a background counts as light. */
    static readonly backgroundLuminanceThreshold = 0.18
    /** Steepness of the chroma parabola. */
    static readonly chromaCurveFactor = 4
    /** Contrast growth per scale step on a dark background. */
    static readonly contrastExponentDark = 3.08
    /** Contrast growth per scale step on a light background. */
    static readonly contrastExponentLight = 2.2
    /** Flare term of the WCAG contrast formula. */
    static readonly contrastOffset = 0.05
    /** Hue shift in degrees between the light and the dark end of the scale. */
    static readonly hueShift = 5

    readonly #backgroundY: number
    readonly #baseHue: number
    readonly #maxChroma: number
    readonly #maxScaleNumber: number
    readonly #minChroma: number

    /** @param backgroundY Relative luminance of the background, e.g. `new okLchColour(hex).luminance`. */
    constructor(maxScaleNumber: number, baseHue: number, minChroma: number, maxChroma: number, backgroundY: number) {
        this.#maxScaleNumber = maxScaleNumber
        this.#baseHue = baseHue
        this.#minChroma = minChroma
        this.#maxChroma = maxChroma
        this.#backgroundY = backgroundY
    }

    /**
     * OKHSL lightness of a luminance, as Ström derives it: CIE L* of the luminance, read as OKLab lightness and passed
     * through the OKHSL toe. colorjs.io performs both steps: a grey with that luminance yields L*, and converting an
     * OKLab grey to OKHSL applies the toe.
     */
    static #luminanceToOkhslLightness(luminance: number): number {
        const grey = new Color(greySpace, whiteCoords)
        grey.luminance = clamp(luminance, luminanceMin, luminanceMax)
        const cieLightness = grey.get(cieLightnessCoordinate) / cieLightnessMax

        return new okHslColour(new Color(oklabSpace, [cieLightness, 0, 0])).l
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
        const parabolaFactor = -ColourScaleGenerator.chromaCurveFactor * chromaDifference
        const linearFactor = ColourScaleGenerator.chromaCurveFactor * chromaDifference

        return parabolaFactor * Math.pow(scaleValue, 2) + linearFactor * scaleValue + this.#minChroma
    }

    #computeScaleHue(scaleValue: number): number {
        return this.#baseHue + ColourScaleGenerator.hueShift * (1 - scaleValue)
    }

    #computeScaleLightness(scaleValue: number): number {
        const { contrastExponentDark, contrastExponentLight, contrastOffset } = ColourScaleGenerator
        const isLightBackground = this.#backgroundY > ColourScaleGenerator.backgroundLuminanceThreshold

        const adjustedScaleValue = isLightBackground ? 1 - scaleValue : scaleValue
        const activeExponent = isLightBackground ? contrastExponentLight : contrastExponentDark

        const exponentialTerm = Math.exp(activeExponent * adjustedScaleValue)
        const adjustedBackground = this.#backgroundY + contrastOffset

        const foregroundY =
            (isLightBackground ? adjustedBackground / exponentialTerm : exponentialTerm * adjustedBackground) -
            contrastOffset

        return ColourScaleGenerator.#luminanceToOkhslLightness(foregroundY)
    }

    #normalizeScaleNumber(scaleNumber: number): number {
        return scaleNumber / this.#maxScaleNumber
    }
}
