import { HslColour } from "./hsl-colour.js";
/**
 * {@link https://matthewstrom.com/writing/generating-color-palettes/}
 *
 * Utility class for perceptually-designed HSL color scale generation.
 * Based on Matthew Ström's color palette generation algorithm.
 */
export declare class ColourScaleGenerator {
    #private;
    constructor(maxScaleNumber: number, baseHue: number, minChroma: number, maxChroma: number, backgroundY: number);
    computeColour(scaleNumber: number): HslColour;
}
//# sourceMappingURL=colour-at-scale.d.ts.map