import { clamp } from "../common.js"
import {
    applyToeCurve,
    backgroundLightnessThreshold,
    lightnessContrastExponent,
    lightnessContrastOffset,
    lightnessMax,
    lightnessMin,
    lightnessScaleFactor,
    yToLightness,
} from "./colour-math"
import { HslColour } from "./hsl-colour.js"

/**
 * {@link https://matthewstrom.com/writing/generating-color-palettes/}
 *
 * Utility class for perceptually-designed Okhsl color scale generation.
 * Based on Matthew Ström's color palette generation algorithm.
 */
export class ColourScaleGenerator {
    // Map Oklab perceptual limit (0.975) to Okhsl percentage space (97.5)
    static readonly #absoluteMaxOkhslLightness = 97.5
    static readonly #coolHueShiftMagnitude = 15
    static readonly #darkChromaScalingMultiplier = 2
    static readonly #lightChromaCompressionFactor = 1.3

    static readonly #lightChromaMinimumRetention = 0.35
    // --- Perceptual Scaling Constants (Okhsl Bounds) ---
    static readonly #scaleMidpoint = 0.5
    static readonly #warmHueShiftMagnitude = 12
    static readonly #warmHueThresholdHigh = 340

    static readonly #warmHueThresholdLow = 100

    // --- Instance Properties ---
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
        const normalizedLightness = clamp(rawLightness / lightnessScaleFactor, lightnessMin, lightnessMax)

        const hue = this.#computeScaleHue(scaleValue)
        const chroma = this.#computeScaleChroma(scaleValue)

        const coords: [number, number, number] = [hue, chroma, normalizedLightness]
        return new HslColour(coords)
    }

    #computeScaleChroma(scaleValue: number): number {
        const chromaDifference = this.#maxChroma - this.#minChroma

        if (scaleValue > ColourScaleGenerator.#scaleMidpoint) {
            // For lighter tones: Flatten the curve to maintain structural pastel saturation
            const chromaAttenuation =
                1 -
                (scaleValue - ColourScaleGenerator.#scaleMidpoint) * ColourScaleGenerator.#lightChromaCompressionFactor
            return (
                this.#minChroma +
                chromaDifference * Math.max(ColourScaleGenerator.#lightChromaMinimumRetention, chromaAttenuation)
            )
        } else {
            // For darker tones: Scale chroma down gracefully to prevent oversaturated dark colors
            return this.#minChroma + chromaDifference * (scaleValue * ColourScaleGenerator.#darkChromaScalingMultiplier)
        }
    }

    #computeScaleHue(scaleValue: number): number {
        const isWarmHue =
            this.#baseHue < ColourScaleGenerator.#warmHueThresholdLow ||
            this.#baseHue > ColourScaleGenerator.#warmHueThresholdHigh

        if (isWarmHue) {
            // Warm tones: Shift warmer (towards yellow) in light, cooler (towards red-violet) in dark
            const warmShift =
                ColourScaleGenerator.#warmHueShiftMagnitude * (scaleValue - ColourScaleGenerator.#scaleMidpoint)
            return this.#baseHue + warmShift
        } else {
            // Cool tones: Shift brighter (towards cyan-green) in light, deeper blue in dark
            const coolShift = ColourScaleGenerator.#coolHueShiftMagnitude * (1 - scaleValue)
            return this.#baseHue + coolShift
        }
    }

    #computeScaleLightness(scaleValue: number): number {
        const exponentialTerm = Math.exp(lightnessContrastExponent * scaleValue)
        const adjustedBackground = this.#backgroundY + lightnessContrastOffset

        const foregroundY =
            this.#backgroundY > backgroundLightnessThreshold
                ? adjustedBackground / exponentialTerm - lightnessContrastOffset
                : exponentialTerm * adjustedBackground - lightnessContrastOffset

        const rawLightness = applyToeCurve(yToLightness(foregroundY))

        // Use Okhsl 0-100 scale limits to cap top value below 100% whiteout
        return clamp(rawLightness / lightnessScaleFactor, lightnessMin, ColourScaleGenerator.#absoluteMaxOkhslLightness)
    }

    #normalizeScaleNumber(scaleNumber: number): number {
        return scaleNumber / this.#maxScaleNumber
    }
}
