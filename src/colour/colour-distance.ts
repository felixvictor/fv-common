import { simulateVisionDeficiency, visionDeficiencies, type VisionDeficiency } from "@/colour/vision-deficiency"
import Color from "colorjs.io"

const deltaEMethod = "2000"

export interface ColourDistance {
    /** Vision deficiency with the smallest distance; undefined for normal vision. */
    readonly deficiency: undefined | VisionDeficiency
    /** Distance (ΔE2000) in the least favourable vision. */
    readonly distance: number
}

/**
 * Perceptual distance (ΔE2000) between two colours, optionally as seen with a vision deficiency.
 *
 * Rough scale: below 5 hard to tell apart, from 10 clearly different, from 20 unmistakable.
 */
export const getColourDistance = (hexA: string, hexB: string, deficiency?: VisionDeficiency): number => {
    const [seenA, seenB] =
        deficiency === undefined
            ? [hexA, hexB]
            : [simulateVisionDeficiency(hexA, deficiency), simulateVisionDeficiency(hexB, deficiency)]

    return new Color(seenA).deltaE(new Color(seenB), deltaEMethod)
}

/**
 * Smallest distance between two colours over normal vision and the given vision deficiencies. Use it for colour pairs
 * that must stay distinguishable for everyone.
 */
export const getMinColourDistance = (
    hexA: string,
    hexB: string,
    deficiencies: readonly VisionDeficiency[] = visionDeficiencies,
): ColourDistance => {
    let minimum: ColourDistance = { deficiency: undefined, distance: getColourDistance(hexA, hexB) }

    for (const deficiency of deficiencies) {
        const distance = getColourDistance(hexA, hexB, deficiency)
        if (distance < minimum.distance) minimum = { deficiency, distance }
    }

    return minimum
}
