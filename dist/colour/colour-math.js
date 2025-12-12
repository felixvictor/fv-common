export class ColourMath {
    static backgroundLightnessThreshold = 0.18;
    static chromaCurveFactor = 4;
    static cieExponent = 1 / 3;
    static cieMultiplierHigh = 116;
    static cieMultiplierLow = 903.296_296_2;
    static cieOffset = 16;
    // CIE lightness conversion thresholds
    static cieThreshold = 0.008_856_451_6;
    // Scale computation constants
    static hueShiftFactor = 5;
    static lightnessContrastExponent = 3.04;
    static lightnessContrastOffset = 0.05;
    static lightnessMax = 1;
    static lightnessMin = 0;
    // Normalization constants
    static lightnessScaleFactor = 100;
    // Toe function coefficients for perceptual lightness adjustment
    static toeK1 = 0.206;
    static toeK2 = 0.03;
    static toeK3 = (1 + ColourMath.toeK1) / (1 + ColourMath.toeK2);
    static applyToeCurve(lightness) {
        const term = ColourMath.toeK3 * lightness - ColourMath.toeK1;
        return 0.5 * (term + Math.sqrt(term * term + 4 * ColourMath.toeK2 * ColourMath.toeK3 * lightness));
    }
    static yToLightness(y) {
        return y <= ColourMath.cieThreshold
            ? y * ColourMath.cieMultiplierLow
            : ColourMath.cieMultiplierHigh * Math.pow(y, ColourMath.cieExponent) - ColourMath.cieOffset;
    }
}
//# sourceMappingURL=colour-math.js.map