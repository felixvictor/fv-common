import Color from "colorjs.io"

import { okHslColour } from "@/colour/okhsl-colour"
import { clamp } from "@/common"

export const backgroundLightnessThreshold = 0.18 as const
export const chromaCurveFactor = 4 as const

export const cieExponent = 1 / 3
export const cieMultiplierHigh = 1.16 as const
export const cieMultiplierLow = 9.032962962 as const
export const cieOffset = 0.16 as const
export const cieThreshold = 0.0088564516 as const

// Scale computation constants
export const hueShiftFactor = 5 as const

export const lightnessContrastExponentLight = 2.2 as const
export const lightnessContrastExponentDark = 3.08 as const
export const lightnessContrastOffset = 0.05 as const
export const lightnessMin = 0 as const
export const lightnessMax = 1 as const

// Toe function coefficients for perceptual lightness adjustment
const toeK1 = 0.206 as const
const toeK2 = 0.03 as const
const toeK3 = (1 + toeK1) / (1 + toeK2)

export const applyToeCurve = (lightness: number): number => {
    // Ensure input is clamped cleanly within bounds before applying curve
    const stableLightness = clamp(lightness, lightnessMin, lightnessMax)
    const term = toeK3 * stableLightness - toeK1
    return 0.5 * (term + Math.sqrt(term * term + 4 * toeK2 * toeK3 * stableLightness))
}

export const yToLightness = (y: number): number => {
    // Normalized CIE Y to Perceptual Lightness conversion (0 to 1 range)
    const stableY = Math.max(lightnessMin, y)
    return stableY <= cieThreshold
        ? stableY * cieMultiplierLow
        : cieMultiplierHigh * Math.pow(stableY, cieExponent) - cieOffset
}

export const luminanceY = (hex: string): number | undefined => {
    const c = new Color(hex).to("xyz-d65")
    return c.coords[1] ?? undefined
}

export const hueDelta = (hex1: string, hex2: string) => {
    const h1 = new okHslColour(hex1).h
    const h2 = new okHslColour(hex2).h
    return Math.abs(((h2 - h1 + 540) % 360) - 180)
}
