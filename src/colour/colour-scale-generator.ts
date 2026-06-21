import type { Coords } from "colorjs.io"

import { descendingScales, scaleNumberMax, type ToneProfile } from "@/colour/md3-tones"

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
    /**
     * How close lightness must get to 1 before a scale number is treated as
     * "already white". Slightly below 1 rather than exactly 1 to tolerate the
     * toe curve's own clamping arriving at the ceiling a touch early.
     */
    readonly #lightnessSaturationThreshold = 0.999
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

    /** Reapplies those fractional positions to the dark base tone and its real (not nominal) lightness ceiling. */
    buildDarkLightenScaleNumbers = (
        profile: ToneProfile,
        referenceGenerator: ColourScaleGenerator,
    ): readonly number[] => {
        const ceiling = this.findLightnessCeiling(referenceGenerator)
        return this.deriveLightenFractions(profile).map(
            (fraction) => Math.round((profile.dark + fraction * (ceiling - profile.dark)) * 10) / 10,
        )
    }

    computeColour(scaleNumber: number): okHslColour {
        const scaleValue = this.#normalizeScaleNumber(scaleNumber)

        const lightness = this.#computeScaleLightness(scaleValue)
        const hue = this.#computeScaleHue(scaleValue)
        const chroma = this.#computeScaleChroma(scaleValue)

        const coords: Coords = [hue, chroma, lightness]
        return new okHslColour(coords)
    }

    /** Converts a family's light-theme milestones into fractional positions between its base tone and white. */
    deriveLightenFractions = (profile: ToneProfile): readonly number[] =>
        profile.lightLightenMilestones.map(
            (milestone) => (milestone - profile.light) / (scaleNumberMax - profile.light),
        )

    /** First scale number (walking down from the ceiling) whose lightness has not yet saturated to white. */
    findLightnessCeiling = (generator: ColourScaleGenerator): number =>
        descendingScales(scaleNumberMax, 0.5).find(
            (scale) => generator.computeColour(scale).l < this.#lightnessSaturationThreshold,
        ) ?? scaleNumberMax

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
