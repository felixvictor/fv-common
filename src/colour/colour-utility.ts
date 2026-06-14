import { ColourScaleGenerator } from "@/colour/colour-at-scale.js"
import { getContrastColour } from "@/colour/common"
import { okHslColour } from "@/colour/ok-hsl-colour.js"

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

    readonly #baseColour: okHslColour
    readonly #baseTint: number
    readonly #onDark: okHslColour
    readonly #onLight: okHslColour

    constructor(baseColourHex: string, baseTint = ColourUtility.defaultBaseTint) {
        this.#baseColour = new okHslColour(baseColourHex)
        this.#baseTint = baseTint
        this.#onDark = this.colourMixin(new okHslColour(ColourUtility.onDarkBase), ColourUtility.onDarkMixAmount)
        this.#onLight = this.colourMixin(new okHslColour(ColourUtility.onLightBase), ColourUtility.onLightMixAmount)
    }

    colourMixin(mixColour: okHslColour | string, mixAmount = ColourUtility.defaultHarmonizationMix) {
        const targetColour = typeof mixColour === "string" ? new okHslColour(mixColour) : mixColour
        const harmonizedBase = new okHslColour([targetColour.h, this.#baseColour.s, this.#baseColour.l])
        return this.mixColours(harmonizedBase, targetColour, ColourUtility.percentageScale - mixAmount)
    }

    getBaseTintedColour(colourHex: string, customTint = this.#baseTint, customMaxSat?: number) {
        return this.getTint(new okHslColour(colourHex), customTint, this.#onLight, false, customMaxSat)
    }

    getColourAtTint(
        tone: number,
        colour: okHslColour,
        background: okHslColour,
        neutral = false,
        maxSatOverride?: number,
    ) {
        const invertedTone = ColourUtility.maxTone - tone
        const hue = colour.h
        const saturation = colour.s

        const activeMaxSat = maxSatOverride ?? ColourUtility.maxSaturation
        const maxSaturation = neutral ? ColourUtility.maxSaturationNeutral : Math.max(activeMaxSat, saturation)

        const backgroundLightness = background.l
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
        const harmonized = this.colourMixin(new okHslColour(colourHex), mixAmount)
        return this.getTint(harmonized, this.#baseTint)
    }

    getHarmonisedColourNeutral(colourHex: string) {
        const harmonized = this.colourMixin(new okHslColour(colourHex), ColourUtility.neutralHarmonizationMix)
        return this.getTint(harmonized, this.#baseTint, this.#onLight, true)
    }

    getOnColour(colour: okHslColour): okHslColour {
        const hex = getContrastColour(colour.hex, ColourUtility.onLightBase, ColourUtility.onDarkBase)
        return new okHslColour(hex)
    }

    getTint(
        colour: okHslColour,
        tone: number,
        backgroundColour = this.#onLight,
        neutral = false,
        customMaxSat?: number,
    ) {
        return this.getColourAtTint(tone, colour, backgroundColour, neutral, customMaxSat)
    }

    mixColours(color1: okHslColour, color2: okHslColour, weightPercentage = this.#baseTint) {
        const weightScale = weightPercentage / ColourUtility.percentageScale
        return okHslColour.mix(color1, color2, weightScale)
    }
}
