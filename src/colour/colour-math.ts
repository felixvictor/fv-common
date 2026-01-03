export const backgroundLightnessThreshold = 0.18 as const
export const chromaCurveFactor = 4 as const
export const cieExponent = 1 / 3

export const cieMultiplierHigh = 116 as const
export const cieMultiplierLow = 903.296_296_2 as const
export const cieOffset = 16 as const
export const cieThreshold = 0.008_856_451_6 as const

// Scale computation constants
export const hueShiftFactor = 5 as const

export const lightnessContrastExponent = 3.04 as const
export const lightnessContrastOffset = 0.05 as const
export const lightnessMax = 1 as const
export const lightnessMin = 0 as const

// Normalization constants
export const lightnessScaleFactor = 100 as const

// Toe function coefficients for perceptual lightness adjustment
const toeK1 = 0.206 as const
const toeK2 = 0.03 as const
const toeK3 = (1 + toeK1) / (1 + toeK2)

export const applyToeCurve = (lightness: number): number => {
    const term = toeK3 * lightness - toeK1
    return 0.5 * (term + Math.sqrt(term * term + 4 * toeK2 * toeK3 * lightness))
}

export const yToLightness = (y: number): number =>
    y <= cieThreshold ? y * cieMultiplierLow : cieMultiplierHigh * Math.pow(y, cieExponent) - cieOffset
