import { HslColour } from "./hsl-colour.js";
export declare class ColourUtility {
    #private;
    static readonly defaultBaseTint = 40;
    static readonly defaultHarmonizationMix = 80;
    static readonly fallbackHue = 0;
    static readonly fallbackLightness = 0;
    static readonly fallbackSaturation = 1;
    static readonly maxSaturation = 0.25;
    static readonly maxSaturationNeutral = 0.2;
    static readonly maxTone = 100;
    static readonly minSaturation = 0;
    static readonly neutralHarmonizationMix = 0;
    static readonly onDarkBase = "#fff";
    static readonly onDarkMixAmount = 5;
    static readonly onLightBase = "#000";
    static readonly onLightMixAmount = 40;
    static readonly percentageScale = 100;
    get baseTint(): number;
    get onDark(): HslColour;
    get onLight(): HslColour;
    constructor(baseColourHex: string, baseTint?: number);
    colourMixin(mixColour: HslColour | string, mixAmount?: number): HslColour;
    getBaseTintedColour(colourHex: string): HslColour;
    getColourAtTint(tone: number, colour: HslColour, background: HslColour, neutral?: boolean): HslColour;
    getHarmonisedColour(colourHex: string, mixAmount?: number): HslColour;
    getHarmonisedColourNeutral(colourHex: string): HslColour;
    getTint(colour: HslColour, tone: number, backgroundColour?: HslColour, neutral?: boolean): HslColour;
    mixColours(color1: HslColour, color2: HslColour, weightPercentage?: number): HslColour;
}
//# sourceMappingURL=colour-utility.d.ts.map