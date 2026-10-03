import { blackHex } from "@/colour/constant"

/** The 13 tones (CIE L*) of an MD3 tonal palette. */
export const md3Tones = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100] as const
export type Md3Tone = (typeof md3Tones)[number]
/** Colours of a palette at the 13 MD3 tones, see {@link md3Tones}. */
export type Md3ToneArray = readonly string[]

/** Index of an MD3 tone within {@link md3Tones} and therefore within an {@link Md3ToneArray}. */
export const ti = (tone: Md3Tone): number => md3Tones.indexOf(tone)

export const fallback = (array: Md3ToneArray, index: number): string => array[index] ?? blackHex

/** Colour of an MD3 tone in an exported tonal range. */
export const getThemeTone = (range: Md3ToneArray, tone: Md3Tone): string => fallback(range, ti(tone))

/** MD3 spec: scrim and shadow are always pure black in both themes, independent of the rest of the palette. */
export const md3ScrimHex = "#000000"
export const md3ShadowHex = "#000000"
