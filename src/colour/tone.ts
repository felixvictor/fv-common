import { okLchColour } from "@/colour/oklch-colour"

/**
 * A tone is CIE L* (0 black – 100 white), as in Material Design 3 (HCT).
 *
 * Tone depends on luminance only, so the WCAG contrast of two colours follows from their tones alone, independent of
 * hue and chroma: a tone difference of 40 gives at least 3:1, a difference of 50 at least 4.5:1.
 */
export const toneMin = 0
export const toneMax = 100

/** Tone (CIE L*, 0–100) of a colour, mapped into sRGB. */
export const getTone = (colour: string): number => new okLchColour(colour).tone
