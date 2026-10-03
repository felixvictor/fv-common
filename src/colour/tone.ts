import { getRelativeLuminance, hexToLinearRgb } from "@/colour/oklch"

/**
 * A tone is CIE L* (0 black – 100 white), as in Material Design 3 (HCT).
 *
 * Tone depends on luminance only, so the WCAG contrast of two colours follows from their tones alone, independent of
 * hue and chroma: a tone difference of 40 gives at least 3:1, a difference of 50 at least 4.5:1.
 */
export const toneMin = 0
export const toneMax = 100

// CIE 1976 L* (CIE 15:2004), luminance normalised to white = 1
const cieEpsilon = 216 / 24_389
const cieKappa = 24_389 / 27
const cieScale = 116
const cieOffset = 16
const cieKappaToneLimit = cieKappa * cieEpsilon

/** Relative luminance (CIE Y, 0–1) of a tone. */
export const toneToLuminance = (tone: number): number =>
    tone > cieKappaToneLimit ? ((tone + cieOffset) / cieScale) ** 3 : tone / cieKappa

/** Tone (CIE L*, 0–100) of a relative luminance. */
export const luminanceToTone = (luminance: number): number =>
    luminance > cieEpsilon ? cieScale * Math.cbrt(luminance) - cieOffset : luminance * cieKappa

/** Tone (CIE L*, 0–100) of a colour. */
export const getTone = (hex: string): number => luminanceToTone(getRelativeLuminance(hexToLinearRgb(hex)))
