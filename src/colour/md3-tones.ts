import { blackHex } from "@/colour/constant"

export interface ToneProfile {
    readonly dark: Md3Tone
    readonly light: Md3Tone
    readonly lightDarkenMilestones: readonly Md3Tone[]
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

export const buildDarkLightenScaleNumbers = (profile: ToneProfile): Md3Tone[] => {
    const lightIndex = ti(profile.light)
    const darkIndex = ti(profile.dark)
    const topIndex = md3Tones.length - 1

    const lightRemaining = topIndex - lightIndex
    const darkRemaining = topIndex - darkIndex
    if (lightRemaining <= 0 || darkRemaining <= 0) return []

    const seen = new Set<Md3Tone>()
    const result: Md3Tone[] = []

    for (const milestone of profile.lightLightenMilestones) {
        const stepsAboveLight = ti(milestone) - lightIndex
        if (stepsAboveLight <= 0) continue // Milestone liegt nicht oberhalb von light, überspringen

        const fraction = stepsAboveLight / lightRemaining
        const rawIndex = darkIndex + fraction * darkRemaining
        const snappedIndex = Math.min(topIndex, Math.max(darkIndex + 1, Math.round(rawIndex)))
        const tone = md3Tones[snappedIndex]

        if (tone !== undefined && !seen.has(tone)) {
            seen.add(tone)
            result.push(tone)
        }
    }

    return result
}

export const buildDarkDarkenScaleNumbers = (
    profile: ToneProfile & { readonly lightDarkenMilestones: readonly Md3Tone[] },
): Md3Tone[] => {
    const lightIndex = ti(profile.light)
    const darkIndex = ti(profile.dark)
    if (lightIndex <= 0 || darkIndex <= 0) return []

    const seen = new Set<Md3Tone>()
    const result: Md3Tone[] = []

    for (const milestone of profile.lightDarkenMilestones) {
        const stepsBelowLight = lightIndex - ti(milestone)
        if (stepsBelowLight <= 0) continue

        const fraction = stepsBelowLight / lightIndex
        const rawIndex = darkIndex - fraction * darkIndex
        const snappedIndex = Math.max(0, Math.min(darkIndex - 1, Math.round(rawIndex)))
        const tone = md3Tones[snappedIndex]

        if (tone !== undefined && !seen.has(tone)) {
            seen.add(tone)
            result.push(tone)
        }
    }

    return result
}
