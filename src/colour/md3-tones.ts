import { blackHex } from "@/colour/constant"

export interface ToneProfile {
    /** Base tone used in the dark theme. */
    readonly dark: Md3Tone
    /** Base tone used in the light theme. */
    readonly light: Md3Tone
    /**
     * The "lighten" milestones that already work correctly in the light
     * theme (each one sits above `light`). They are reinterpreted as
     * fractional positions and reapplied relative to `dark` and its real
     * lightness ceiling – see `buildDarkLightenScaleNumbers`.
     */
    readonly lightLightenMilestones: readonly Md3Tone[]
}

// ---------------------------------------------------------------------------
// MD3 tone steps and named index aliases
//
// md3Tones[index] = tone value: ti(10) = index 1, ti(99) = index 11, etc.
// ---------------------------------------------------------------------------

export const md3Tones = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100] as const
export type Md3Tone = (typeof md3Tones)[number]
export type Md3ToneArray = readonly string[]

export const ti = (tone: Md3Tone): number => md3Tones.indexOf(tone)

/** Scale number ceiling passed to ColourScaleGenerator (tones run 0–100). */
export const scaleNumberMax = md3Tones[ti(100)] ?? 100
/** Resolves a single scale number to a hex colour, snapping the two extremes to true black/white. */
export const minTone = md3Tones[0]
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
export const maxTone = md3Tones.at(-1)!

/** Looks up a value by MD3 tone, falling back to true black if the array is somehow short. */
export const fallback = (array: Md3ToneArray, index: number): string => array[index] ?? blackHex
