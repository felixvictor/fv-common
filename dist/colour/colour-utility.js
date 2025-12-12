import { ColourScaleGenerator } from "./colour-at-scale.js";
import { HslColour } from "./hsl-colour.js";
export class ColourUtility {
    static defaultBaseTint = 40;
    static defaultHarmonizationMix = 80;
    static fallbackHue = 0;
    static fallbackLightness = 0;
    static fallbackSaturation = 1;
    static maxSaturation = 0.25;
    static maxSaturationNeutral = 0.2;
    static maxTone = 100;
    static minSaturation = 0;
    static neutralHarmonizationMix = 0;
    static onDarkBase = "#fff";
    static onDarkMixAmount = 5;
    static onLightBase = "#000";
    static onLightMixAmount = 40;
    static percentageScale = 100;
    get baseTint() {
        return this.#baseTint;
    }
    get onDark() {
        return this.#onDark;
    }
    get onLight() {
        return this.#onLight;
    }
    #baseColour;
    #baseTint;
    #onDark;
    #onLight;
    constructor(baseColourHex, baseTint = ColourUtility.defaultBaseTint) {
        this.#baseColour = new HslColour(baseColourHex);
        this.#baseTint = baseTint;
        this.#onDark = this.colourMixin(new HslColour(ColourUtility.onDarkBase), ColourUtility.onDarkMixAmount);
        this.#onLight = this.colourMixin(new HslColour(ColourUtility.onLightBase), ColourUtility.onLightMixAmount);
    }
    colourMixin(mixColour, mixAmount = ColourUtility.defaultHarmonizationMix) {
        const targetColour = typeof mixColour === "string" ? new HslColour(mixColour) : mixColour;
        const harmonizedBase = new HslColour([targetColour.h, this.#baseColour.s, this.#baseColour.l]);
        return this.mixColours(harmonizedBase, targetColour, ColourUtility.percentageScale - mixAmount);
    }
    getBaseTintedColour(colourHex) {
        return this.getTint(new HslColour(colourHex), this.#baseTint);
    }
    getColourAtTint(tone, colour, background, neutral = false) {
        const invertedTone = ColourUtility.maxTone - tone;
        const hue = colour.h;
        const saturation = colour.s;
        const maxSaturation = neutral
            ? ColourUtility.maxSaturationNeutral
            : Math.max(ColourUtility.maxSaturation, saturation);
        const backgroundLightness = background.l;
        const invertedBackgroundLightness = 1 - backgroundLightness;
        const generator = new ColourScaleGenerator(ColourUtility.maxTone, hue, ColourUtility.minSaturation, maxSaturation, invertedBackgroundLightness);
        return generator.computeColour(invertedTone);
    }
    getHarmonisedColour(colourHex, mixAmount) {
        const harmonized = this.colourMixin(new HslColour(colourHex), mixAmount);
        this.getTint(harmonized, this.#baseTint);
    }
    getHarmonisedColourNeutral(colourHex) {
        const harmonized = this.colourMixin(new HslColour(colourHex), ColourUtility.neutralHarmonizationMix);
        this.getTint(harmonized, this.#baseTint, this.#onLight, true);
    }
    getTint(colour, tone, backgroundColour = this.#onLight, neutral = false) {
        return this.getColourAtTint(tone, colour, backgroundColour, neutral);
    }
    mixColours(color1, color2, weightPercentage = this.#baseTint) {
        const weightScale = weightPercentage / ColourUtility.percentageScale;
        return HslColour.mix(color1, color2, weightScale);
    }
}
//# sourceMappingURL=colour-utility.js.map