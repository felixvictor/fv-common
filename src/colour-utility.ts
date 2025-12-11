import { computeColorAtScaleNumber } from "./colour-at-scale.js"
import { HslColour } from "./hsl-colour.js"

export class ColourUtility {
    get baseTint() {
        return this.#baseTint
    }

    get onDark() {
        return this.#onDark
    }

    get onLight() {
        return this.#onLight
    }

    // Derived values based on constructor value
    readonly #baseColour: HslColour

    // Base values
    readonly #baseTint = 40
    // Parameters
    readonly #maxSat = 0.25

    readonly #maxSatNeutral = 0.2
    readonly #maxTone = 100
    readonly #onDark: HslColour

    readonly #onDarkBase = "#fff"

    readonly #onLight: HslColour

    readonly #onLightBase = "#000"

    constructor(baseColourHex: string) {
        this.#baseColour = new HslColour(baseColourHex)
        this.#onDark = this.colourMixin(new HslColour(this.#onDarkBase), 5)
        this.#onLight = this.colourMixin(new HslColour(this.#onLightBase), 40)
    }

    colourMixin(mixColour: HslColour | string, mix = 80) {
        const c = typeof mixColour === "string" ? new HslColour(mixColour) : mixColour
        const baseColour = new HslColour([c.h, this.#baseColour.s, this.#baseColour.l])
        return this.mixColours(baseColour, c, 100 - mix)
    }

    getBaseTintedColour(colourHex: string) {
        return this.getTint(new HslColour(colourHex), this.#baseTint)
    }

    getColourAtTint(tone: number, colour: HslColour, background: HslColour, neutral = false) {
        return computeColorAtScaleNumber(
            this.#maxTone - tone,
            this.#maxTone,
            colour.h ?? 0,
            0,
            neutral ? this.#maxSatNeutral : Math.max(this.#maxSat, colour.s ?? 1),
            1 - (background.l ?? 0),
        )
    }

    getHarmonisedColour(colourHex: string, mix?: number) {
        return this.getTint(this.colourMixin(new HslColour(colourHex), mix), this.#baseTint)
    }

    getHarmonisedColourNeutral(colourHex: string) {
        return this.getTint(this.colourMixin(new HslColour(colourHex), 0), this.#baseTint, this.onLight, true)
    }

    getTint(colour: HslColour, tone: number, backgroundColour = this.#onLight, neutral = false) {
        return this.getColourAtTint(tone, colour, backgroundColour, neutral)
    }

    mixColours(color1Input: HslColour, color2Input: HslColour, weight = this.#baseTint) {
        const weightScale = weight / 100
        return HslColour.mix(color1Input, color2Input, weightScale)
    }
}
