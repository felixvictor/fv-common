export class ColourMath {
    static readonly backgroundLightnessThreshold = 0.18
    static readonly chromaCurveFactor = 4
    static readonly cieExponent = 1 / 3

    static readonly cieMultiplierHigh = 116
    static readonly cieMultiplierLow = 903.296_296_2
    static readonly cieOffset = 16
    // CIE lightness conversion thresholds
    static readonly cieThreshold = 0.008_856_451_6
    // Scale computation constants
    static readonly hueShiftFactor = 5

    static readonly lightnessContrastExponent = 3.04
    static readonly lightnessContrastOffset = 0.05
    static readonly lightnessMax = 1
    static readonly lightnessMin = 0
    // Normalization constants
    static readonly lightnessScaleFactor = 100

    // Toe function coefficients for perceptual lightness adjustment
    static readonly toeK1 = 0.206
    static readonly toeK2 = 0.03
    static readonly toeK3 = (1 + ColourMath.toeK1) / (1 + ColourMath.toeK2)

    static applyToeCurve(lightness: number): number {
        const term = ColourMath.toeK3 * lightness - ColourMath.toeK1
        return 0.5 * (term + Math.sqrt(term * term + 4 * ColourMath.toeK2 * ColourMath.toeK3 * lightness))
    }

    static yToLightness(y: number): number {
        return y <= ColourMath.cieThreshold
            ? y * ColourMath.cieMultiplierLow
            : ColourMath.cieMultiplierHigh * Math.pow(y, ColourMath.cieExponent) - ColourMath.cieOffset
    }
}
