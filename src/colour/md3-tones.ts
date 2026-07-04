import { blackHex } from "@/colour/constant"

export const md3Tones = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100] as const
export type Md3Tone = (typeof md3Tones)[number]
export type Md3ToneArray = readonly string[]

export const ti = (tone: Md3Tone): number => md3Tones.indexOf(tone)

export const scaleNumberMax = md3Tones[ti(100)] ?? 100
export const minTone = md3Tones[0]
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const maxTone = md3Tones.at(-1)!

export const fallback = (array: Md3ToneArray, index: number): string => array[index] ?? blackHex

/** Direct, absolute lookup by MD3 tone – the recommended way to pull any
 *  colour out of a tonal range without relying on an ordinal "N steps from
 *  base" concept (which breaks whenever the base tone itself changes). */
export const getThemeTone = (range: Md3ToneArray, tone: Md3Tone): string => fallback(range, ti(tone))

export const md3AccentToneLight: Md3Tone = 40
export const md3AccentToneDark: Md3Tone = 80
export const md3AccentOnToneLight: Md3Tone = 99
export const md3AccentOnToneDark: Md3Tone = 10
export const md3ContainerToneLight: Md3Tone = 90
export const md3ContainerToneDark: Md3Tone = 30
export const md3OnContainerToneLight: Md3Tone = 10
export const md3OnContainerToneDark: Md3Tone = 90

/** MD3 spec: scrim and shadow are always pure black in both themes,
 *  independent of the rest of the palette. */
export const md3ScrimHex = "#000000"
export const md3ShadowHex = "#000000"
