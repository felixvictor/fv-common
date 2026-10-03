import { blackHex } from "@/colour/constant"

/**
 * Tones (CIE L*) of an exported palette range: 6 to 94 in steps of 8. Neighbouring colours of every palette are at
 * least ΔE2000 5 apart, so each step is distinguishable; black and white, the same for every palette, are left out.
 */
export const paletteRangeTones = [6, 14, 22, 30, 38, 46, 54, 62, 70, 78, 86, 94] as const
/** Colours of a palette at {@link paletteRangeTones}, darkest first. */
export type PaletteRange = readonly string[]

export type PaletteRangeTone = (typeof paletteRangeTones)[number]

/** Colour of a tone in an exported palette range. */
export const getRangeColour = (range: PaletteRange, tone: PaletteRangeTone): string =>
    range[paletteRangeTones.indexOf(tone)] ?? blackHex
