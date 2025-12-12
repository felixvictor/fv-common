import { ColourScaleGenerator } from "./colour-at-scale.js"
import { HslColour } from "./hsl-colour.js"

export class ColourUtility {
    static readonly defaultBaseTint = 40
    static readonly defaultHarmonizationMix = 80
    static readonly fallbackHue = 0
    static readonly fallbackLightness = 0
    static readonly fallbackSaturation = 1
    static readonly maxSaturation = 0.25
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

    colourMixin(mixColour: HslColour | string, mixAmount = ColourUtility.defaultHarmonizationMix) {
        const targetColour = typeof mixColour === "string" ? new HslColour(mixColour) : mixColour
        const harmonizedBase = new HslColour([targetColour.h, this.#baseColour.s, this.#baseColour.l])
        return this.mixColours(harmonizedBase, targetColour, ColourUtility.percentageScale - mixAmount)
    }

    getBaseTintedColour(colourHex: string) {
        return this.getTint(new HslColour(colourHex), this.#baseTint)
    }

    getColourAtTint(tone: number, colour: HslColour, background: HslColour, neutral = false) {
        const invertedTone = ColourUtility.maxTone - tone
        const hue = colour.h
        const saturation = colour.s
        const maxSaturation = neutral
            ? ColourUtility.maxSaturationNeutral
            : Math.max(ColourUtility.maxSaturation, saturation)
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
        const harmonized = this.colourMixin(new HslColour(colourHex), mixAmount)
        return this.getTint(harmonized, this.#baseTint)
    }

    getHarmonisedColourNeutral(colourHex: string) {
        const harmonized = this.colourMixin(new HslColour(colourHex), ColourUtility.neutralHarmonizationMix)
        return this.getTint(harmonized, this.#baseTint, this.#onLight, true)
    }

    getTint(colour: HslColour, tone: number, backgroundColour = this.#onLight, neutral = false) {
        return this.getColourAtTint(tone, colour, backgroundColour, neutral)
    }

    mixColours(color1: HslColour, color2: HslColour, weightPercentage = this.#baseTint) {
        const weightScale = weightPercentage / ColourUtility.percentageScale
        return HslColour.mix(color1, color2, weightScale)
    }
}
