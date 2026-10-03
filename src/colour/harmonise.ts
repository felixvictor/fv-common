import { getHueDifference, normaliseHue, type Oklch } from "@/colour/oklch"
import { clampUnsafe, lerpUnsafe } from "@/common"

/**
 * How strongly a colour is pulled towards a target colour (usually primary).
 *
 * The hue part follows MD3 `Blend.harmonize` (rotate by half the hue difference, at most 15°) but works in OKLCH and
 * stops at a minimum distance, so colours near primary do not merge with it. The chroma part has no MD3 counterpart: it
 * tones down colours that are more colourful than the target, which OKLCH chroma allows because it is comparable across
 * hues. Muted colours keep their chroma, as raising it would erase deliberate differences.
 */
export interface HarmonisationStrength {
    /** Share of the chroma above the target's chroma that is removed, 0–1. */
    readonly chromaFactor: number
    /** Share of the hue difference to the target that is removed, 0–1. */
    readonly hueFactor: number
    /** Upper bound of the hue rotation in degrees. */
    readonly maxHueRotation: number
    /** Hue distance to the target in degrees that the rotation never undercuts; closer colours keep their hue. */
    readonly minHueDistance: number
}

export const noHarmonisation: HarmonisationStrength = {
    chromaFactor: 0,
    hueFactor: 0,
    maxHueRotation: 0,
    minHueDistance: 0,
}

/**
 * Rotates a hue towards the target hue along the shorter way round.
 *
 * Near 180° apart the shorter way flips with small changes of either hue, so the direction of complementary colours is
 * unstable; keep `maxHueRotation` small for colours whose meaning depends on their hue.
 */
export const harmoniseHue = (
    hue: number,
    targetHue: number,
    { hueFactor, maxHueRotation, minHueDistance }: HarmonisationStrength,
): number => {
    const difference = getHueDifference(hue, targetHue)
    const distance = Math.abs(difference)
    const rotation = clampUnsafe(
        distance * hueFactor,
        0,
        Math.min(maxHueRotation, Math.max(0, distance - minHueDistance)),
    )
    return normaliseHue(hue + Math.sign(difference) * rotation)
}

/** Lowers a chroma above the target chroma by `chromaFactor` of the excess; lower chroma stays unchanged. */
export const harmoniseChroma = (
    chroma: number,
    targetChroma: number,
    { chromaFactor }: HarmonisationStrength,
): number => (chroma > targetChroma ? lerpUnsafe(chroma, targetChroma, chromaFactor) : chroma)

/** Pulls hue and chroma of a colour towards the target; lightness stays unchanged. */
export const harmoniseOklch = (colour: Oklch, target: Oklch, strength: HarmonisationStrength): Oklch => ({
    chroma: harmoniseChroma(colour.chroma, target.chroma, strength),
    hue: harmoniseHue(colour.hue, target.hue, strength),
    lightness: colour.lightness,
})
