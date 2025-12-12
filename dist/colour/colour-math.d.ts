export declare class ColourMath {
    static readonly backgroundLightnessThreshold = 0.18;
    static readonly chromaCurveFactor = 4;
    static readonly cieExponent: number;
    static readonly cieMultiplierHigh = 116;
    static readonly cieMultiplierLow = 903.2962962;
    static readonly cieOffset = 16;
    static readonly cieThreshold = 0.0088564516;
    static readonly hueShiftFactor = 5;
    static readonly lightnessContrastExponent = 3.04;
    static readonly lightnessContrastOffset = 0.05;
    static readonly lightnessMax = 1;
    static readonly lightnessMin = 0;
    static readonly lightnessScaleFactor = 100;
    static readonly toeK1 = 0.206;
    static readonly toeK2 = 0.03;
    static readonly toeK3: number;
    static applyToeCurve(lightness: number): number;
    static yToLightness(y: number): number;
}
//# sourceMappingURL=colour-math.d.ts.map