export const backgroundLightnessThreshold = 0.18 as const
export const chromaCurveFactor = 4 as const

export const cieExponent = 1 / 3
export const cieMultiplierHigh = 1.16 as const
export const cieMultiplierLow = 9.032962962 as const
export const cieOffset = 0.16 as const
export const cieThreshold = 0.0088564516 as const

// Scale computation constants
export const hueShiftFactor = 5 as const

export const lightnessContrastExponent = 3.04 as const
export const lightnessContrastOffset = 0.05 as const

// Toe function coefficients for perceptual lightness adjustment
const toeK1 = 0.206 as const
const toeK2 = 0.03 as const
const toeK3 = (1 + toeK1) / (1 + toeK2)

export const applyToeCurve = (lightness: number): number => {
    // Ensure input is clamped cleanly within bounds before applying curve
    const stableLightness = Math.max(0, Math.min(1, lightness))
    const term = toeK3 * stableLightness - toeK1
    return 0.5 * (term + Math.sqrt(term * term + 4 * toeK2 * toeK3 * stableLightness))
}

export const yToLightness = (y: number): number => {
    // Normalized CIE Y to Perceptual Lightness conversion (0 to 1 range)
    const stableY = Math.max(0, y)
    return stableY <= cieThreshold
        ? stableY * cieMultiplierLow
        : cieMultiplierHigh * Math.pow(stableY, cieExponent) - cieOffset
}
