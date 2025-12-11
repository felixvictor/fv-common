import Color, { type Coords } from "colorjs.io";
export declare class HslColour {
    #private;
    get colourObject(): Color;
    get h(): null | number;
    set h(h: null | number);
    get hex(): string;
    get l(): null | number;
    set l(l: null | number);
    get s(): null | number;
    set s(s: null | number);
    constructor(argument: Color | Coords | string);
    static mix(color1Input: HslColour, color2Input: HslColour, weightScale: number): HslColour;
}
//# sourceMappingURL=hsl-colour.d.ts.map