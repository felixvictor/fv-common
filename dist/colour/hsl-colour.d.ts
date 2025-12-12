import Color, { type Coords } from "colorjs.io";
export declare class HslColour {
    #private;
    static readonly colorSpace = "okhsl";
    static readonly hexFormat = "hex";
    static readonly hueMax = 360;
    static readonly hueMin = 0;
    static readonly lightnessMax = 100;
    static readonly lightnessMin = 0;
    static readonly outputColorSpace = "srgb";
    static readonly saturationMax = 100;
    static readonly saturationMin = 0;
    get colourObject(): Color;
    get h(): number;
    set h(value: number | string);
    get hex(): string;
    get l(): number;
    set l(value: number | string);
    get s(): number;
    set s(value: number | string);
    constructor(argument: Color | Coords | string);
    static mix(color1: HslColour, color2: HslColour, weight: number): HslColour;
    clone(): HslColour;
    toString(): string;
}
//# sourceMappingURL=hsl-colour.d.ts.map