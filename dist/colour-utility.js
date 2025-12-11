import { computeColorAtScaleNumber } from "./colour-at-scale.js";
import { HslColour } from "./hsl-colour.js";
export class ColourUtility {
    get baseTint() {
        return this.#baseTint;
    }
    get onDark() {
        return this.#onDark;
    }
    get onLight() {
        return this.#onLight;
    }
    // Derived values based on constructor value
    #baseColour;
    // Base values
    #baseTint = 40;
    // Parameters
    #maxSat = 0.25;
    #maxSatNeutral = 0.2;
    #maxTone = 100;
    #onDark;
    #onDarkBase = "#fff";
    #onLight;
    #onLightBase = "#000";
    constructor(baseColourHex) {
        this.#baseColour = new HslColour(baseColourHex);
        this.#onDark = this.colourMixin(new HslColour(this.#onDarkBase), 5);
        this.#onLight = this.colourMixin(new HslColour(this.#onLightBase), 40);
    }
    colourMixin(mixColour, mix = 80) {
        const c = typeof mixColour === "string" ? new HslColour(mixColour) : mixColour;
        const baseColour = new HslColour([c.h, this.#baseColour.s, this.#baseColour.l]);
        return this.mixColours(baseColour, c, 100 - mix);
    }
    getBaseTintedColour(colourHex) {
        return this.getTint(new HslColour(colourHex), this.#baseTint);
    }
    getColourAtTint(tone, colour, background, neutral = false) {
        return computeColorAtScaleNumber(this.#maxTone - tone, this.#maxTone, colour.h ?? 0, 0, neutral ? this.#maxSatNeutral : Math.max(this.#maxSat, colour.s ?? 1), 1 - (background.l ?? 0));
    }
    getHarmonisedColour(colourHex, mix) {
        return this.getTint(this.colourMixin(new HslColour(colourHex), mix), this.#baseTint);
    }
    getHarmonisedColourNeutral(colourHex) {
        return this.getTint(this.colourMixin(new HslColour(colourHex), 0), this.#baseTint, this.onLight, true);
    }
    getTint(colour, tone, backgroundColour = this.#onLight, neutral = false) {
        return this.getColourAtTint(tone, colour, backgroundColour, neutral);
    }
    mixColours(color1Input, color2Input, weight = this.#baseTint) {
        const weightScale = weight / 100;
        return HslColour.mix(color1Input, color2Input, weightScale);
    }
}
//# sourceMappingURL=colour-utility.js.map