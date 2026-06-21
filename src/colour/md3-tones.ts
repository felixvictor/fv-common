import { ColourScaleGenerator } from "@/colour/colour-scale-generator"
import { blackHex, whiteHex } from "@/colour/constant"
import { okHslColour } from "@/colour/okhsl-colour"

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

const md3Tones = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100] as const
type Md3Tone = (typeof md3Tones)[number]
type Md3ToneArray = readonly string[]

export const ti = (tone: Md3Tone): number => md3Tones.indexOf(tone)

/** How far below the seed's saturation the chroma falls at the dark extreme. */
const chromaMinOffset = 0.35
/** How far above the seed's saturation the chroma peaks at mid-tones. */
const chromaMaxOffset = 0.05
/** Scale number ceiling passed to ColourScaleGenerator (tones run 0–100). */
export const scaleNumberMax = md3Tones[ti(100)] ?? 100
/** Resolves a single scale number to a hex colour, snapping the two extremes to true black/white. */
export const minTone = md3Tones[0]
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const maxTone = md3Tones.at(-1)!

// ---------------------------------------------------------------------------
// Generator plumbing
//
// `ColourScaleGenerator.computeColour(n)` accepts *any* scale number from
// 0–100, not just the thirteen named MD3 milestones above. Keeping the
// generator itself around (rather than only the resolved hex array) is
// what lets the dark-theme "lighten" fix below request bespoke, in-between
// scale numbers instead of being limited to those thirteen milestones.
// ---------------------------------------------------------------------------

export const buildGenerator = (hex: string, backgroundY: number): ColourScaleGenerator => {
    const seed = new okHslColour(hex)
    const minChroma = Math.max(0, seed.s - chromaMinOffset)
    const maxChroma = Math.min(1, seed.s + chromaMaxOffset)
    return new ColourScaleGenerator(scaleNumberMax, seed.h, minChroma, maxChroma, backgroundY)
}

export const buildMd3Range = (generator: ColourScaleGenerator): Md3ToneArray =>
    md3Tones.map((tone) => colourAtScale(generator, tone))

export const colourAtScale = (generator: ColourScaleGenerator, scaleNumber: number): string => {
    if (scaleNumber <= minTone) return blackHex
    if (scaleNumber >= maxTone) return whiteHex
    return generator.computeColour(scaleNumber).hex
}

/** Yields descending scale numbers; an ES2025 iterator so the search below never has to materialise an array. */
export function* descendingScales(from: number, step: number): Generator<number> {
    for (let scale = from; scale > minTone; scale -= step) yield scale
}
