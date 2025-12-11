import { HslColour } from "./hsl-colour.js";
export declare class ColourUtility {
    #private;
    get baseTint(): number;
    get onDark(): HslColour;
    get onLight(): HslColour;
    constructor(baseColourHex: string);
    colourMixin(mixColour: HslColour | string, mix?: number): HslColour;
    getBaseTintedColour(colourHex: string): HslColour;
    getColourAtTint(tone: number, colour: HslColour, background: HslColour, neutral?: boolean): HslColour;
    getHarmonisedColour(colourHex: string, mix?: number): HslColour;
    getHarmonisedColourNeutral(colourHex: string): HslColour;
    getTint(colour: HslColour, tone: number, backgroundColour?: HslColour, neutral?: boolean): HslColour;
    mixColours(color1Input: HslColour, color2Input: HslColour, weight?: number): HslColour;
}
//# sourceMappingURL=colour-utility.d.ts.map