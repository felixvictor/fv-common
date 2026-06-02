import Color from "colorjs.io"

import { ColourScaleGenerator } from "@/colour/colour-at-scale.js"
import { getContrastColour } from "@/colour/common"
import { HslColour } from "@/colour/hsl-colour.js"

export class ColourUtility {
    static readonly defaultBaseTint = 40
    static readonly defaultHarmonizationMix = 80
    static readonly fallbackHue = 0
    static readonly fallbackLightness = 0
    static readonly fallbackSaturation = 1
    static readonly maxSaturation = 0.85
    static readonly maxSaturationNeutral = 0.2
    static readonly maxTone = 100
    static readonly minSaturation = 0
    static readonly neutralHarmonizationMix = 0
    static readonly onDarkBase = "#fff"
    static readonly onDarkMixAmount = 5
    static readonly onLightBase = "#000"
    static readonly onLightMixAmount = 40
    static readonly percentageScale = 100

    get baseTint() {
        return this.#baseTint
    }
    get onDark() {
        return this.#onDark
    }
    get onLight() {
        return this.#onLight
    }

    readonly #baseColour: HslColour
    readonly #baseTint: number
    readonly #onDark: HslColour
    readonly #onLight: HslColour

    constructor(baseColourHex: string, baseTint = ColourUtility.defaultBaseTint) {
        this.#baseColour = new HslColour(baseColourHex)
        this.#baseTint = baseTint
        this.#onDark = this.colourMixin(new HslColour(ColourUtility.onDarkBase), ColourUtility.onDarkMixAmount)
        this.#onLight = this.colourMixin(new HslColour(ColourUtility.onLightBase), ColourUtility.onLightMixAmount)
    }

    colourMixin(mixColour: HslColour | string, mixAmount = ColourUtility.defaultHarmonizationMix): HslColour {
        const target = typeof mixColour === "string" ? new HslColour(mixColour) : mixColour

        // 1. Grab the native colorjs.io objects directly from your HslColour instances
        const targetOkhsl = target.colourObject
        const baseOkhsl = this.#baseColour.colourObject

        // 2. Project both into true spatial Oklab coordinates
        const targetOklab = targetOkhsl.to("oklab")
        const baseOklab = baseOkhsl.to("oklab")

        // 3. Extract coordinates
        const targetL = targetOklab.coords[0] ?? 0
        const targetA = targetOklab.coords[1] ?? 0
        const targetB = targetOklab.coords[2] ?? 0

        const baseA = baseOklab.coords[1] ?? 0
        const baseB = baseOklab.coords[2] ?? 0

        const mixRatio = mixAmount / ColourUtility.percentageScale

        // 4. Interpolate only the chromatic axis vectors
        const harmonizedA = targetA * (1 - mixRatio) + baseA * mixRatio
        const harmonizedB = targetB * (1 - mixRatio) + baseB * mixRatio

        // 5. Construct the new Oklab coordinate set and map it back into your Okhsl system
        const resultOklab = new Color("oklab", [targetL, harmonizedA, harmonizedB])
        const resultOkhsl = resultOklab.to(HslColour.colorSpace)

        // 6. Map colorjs.io (0.0 - 1.0) back to your HslColour (0 - 100) percentage space
        const rawHue = resultOkhsl.coords[0] ?? 0
        const hue = Number.isNaN(rawHue) ? 0 : rawHue
        const saturation = (resultOkhsl.coords[1] ?? 0) * ColourUtility.percentageScale
        const lightness = (resultOkhsl.coords[2] ?? 0) * ColourUtility.percentageScale

        return new HslColour([hue, saturation, lightness])
    }

    getBaseTintedColour(colourHex: string, customTint = this.#baseTint, customMaxSat?: number) {
        return this.getTint(new HslColour(colourHex), customTint, this.#onLight, false, customMaxSat)
    }

    getColourAtTint(tone: number, colour: HslColour, background: HslColour, neutral = false, maxSatOverride?: number) {
        const invertedTone = ColourUtility.maxTone - tone
        const hue = colour.h
        const saturation = colour.s

        const activeMaxSat = maxSatOverride ?? ColourUtility.maxSaturation
        const maxSaturation = neutral ? ColourUtility.maxSaturationNeutral : Math.max(activeMaxSat, saturation)

        // Convert the structural background lightness to its raw 0-1 coordinate equivalent
        const backgroundLightness = background.l / ColourUtility.percentageScale
        const invertedBackgroundLightness = 1 - backgroundLightness

        const generator = new ColourScaleGenerator(
            ColourUtility.maxTone,
            hue,
            ColourUtility.minSaturation,
            maxSaturation,
            invertedBackgroundLightness,
        )
        return generator.computeColour(invertedTone)
    }

    getHarmonisedColour(colourHex: string, mixAmount?: number) {
        const harmonized = this.colourMixin(new HslColour(colourHex), mixAmount)
        return this.getTint(harmonized, this.#baseTint)
    }

    getHarmonisedColourNeutral(colourHex: string) {
        const harmonized = this.colourMixin(new HslColour(colourHex), ColourUtility.neutralHarmonizationMix)
        return this.getTint(harmonized, this.#baseTint, this.#onLight, true)
    }

    getOnColour(colour: HslColour): HslColour {
        const hex = getContrastColour(colour.hex, ColourUtility.onLightBase, ColourUtility.onDarkBase)
        return new HslColour(hex)
    }

    getTint(colour: HslColour, tone: number, backgroundColour = this.#onLight, neutral = false, customMaxSat?: number) {
        return this.getColourAtTint(tone, colour, backgroundColour, neutral, customMaxSat)
    }

    mixColours(color1: HslColour, color2: HslColour, weightPercentage = this.#baseTint) {
        const weightScale = weightPercentage / ColourUtility.percentageScale
        return HslColour.mix(color1, color2, weightScale)
    }
}
