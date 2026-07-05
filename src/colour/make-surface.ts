import { okHslColour } from "@/colour/okhsl-colour"
import { minSurfaceLightnessDelta } from "@/colour/validation"

type ThemeMode = "dark" | "light"

interface Tone {
    /** Multiplier applied to the seed's own saturation – not an absolute value. */
    readonly chroma: number
    readonly lightness: number
}

type ToneByMode = Record<ThemeMode, Tone>

/**
 * Roles resolved from absolute lightness/chroma pairs – no relative
 * stepping, unlike the surface ladder below.
 */
const semanticTones = {
    onSurface: {
        dark: { chroma: 0.06, lightness: 0.92 },
        light: { chroma: 0.1, lightness: 0.12 },
    },
    onSurfaceVariant: {
        dark: { chroma: 0.1, lightness: 0.78 },
        light: { chroma: 0.16, lightness: 0.32 },
    },
    outline: {
        dark: { chroma: 0.14, lightness: 0.62 },
        light: { chroma: 0.2, lightness: 0.48 },
    },
    outlineVariant: {
        dark: { chroma: 0.1, lightness: 0.32 },
        light: { chroma: 0.14, lightness: 0.82 },
    },
} as const satisfies Record<string, ToneByMode>

/**
 * The four surface roles form a ladder around a per-theme anchor: each
 * rung sits `stepDelta` lightness-steps away from `main`, with its own
 * chroma multiplier on top of the theme's base chroma. Step direction
 * differs between themes (light theme darkens towards `variant`, dark
 * theme lightens towards it), so direction is encoded per rung rather
 * than assumed.
 */
interface LadderRung {
    readonly chromaFactor: number
    readonly stepDelta: number
}

type SemanticRole = keyof typeof semanticTones

const surfaceLadder = {
    dark: {
        anchorLightness: 0.06,
        baseChroma: 0.12,
        rungs: {
            bright: { chromaFactor: 1.3, stepDelta: 2 },
            light: { chromaFactor: 1.1, stepDelta: 1 },
            main: { chromaFactor: 1, stepDelta: 0 },
            variant: { chromaFactor: 1.8, stepDelta: 3 },
        },
    },
    light: {
        anchorLightness: 0.95,
        baseChroma: 0.42,
        rungs: {
            bright: { chromaFactor: 0.6, stepDelta: 1 },
            light: { chromaFactor: 1.2, stepDelta: -1 },
            main: { chromaFactor: 1, stepDelta: 0 },
            variant: { chromaFactor: 1.5, stepDelta: -2 },
        },
    },
} as const satisfies Record<
    ThemeMode,
    { anchorLightness: number; baseChroma: number; rungs: Record<string, LadderRung> }
>

type SurfaceRung = keyof typeof surfaceLadder.light.rungs

const paddingL = 0.005
const stepL = minSurfaceLightnessDelta + paddingL

export class MakeSurface {
    readonly #base: okHslColour

    constructor(baseHex: string) {
        this.#base = new okHslColour(baseHex)
    }

    /** Direct, absolute lookup for one-off tones not covered by the tables above. */
    calculateSurface(lightness: number, chromaFactor: number): string {
        return this.#resolve({ chroma: chromaFactor, lightness })
    }

    makeSurface(): Record<ThemeMode, Record<SemanticRole, string> & Record<SurfaceRung, string>> {
        return {
            dark: { ...this.#ladderFamily("dark"), ...this.#semanticFamily("dark") },
            light: { ...this.#ladderFamily("light"), ...this.#semanticFamily("light") },
        }
    }

    #ladderFamily(mode: ThemeMode): Record<SurfaceRung, string> {
        const { anchorLightness, baseChroma, rungs } = surfaceLadder[mode]
        return Object.fromEntries(
            Object.entries(rungs).map(([rung, { chromaFactor, stepDelta }]) => [
                rung,
                this.#resolve({
                    chroma: baseChroma * chromaFactor,
                    lightness: anchorLightness + stepDelta * stepL,
                }),
            ]),
        ) as Record<SurfaceRung, string>
    }

    #resolve({ chroma, lightness }: Tone): string {
        return new okHslColour([this.#base.h, this.#base.s * chroma, lightness]).hex
    }

    #semanticFamily(mode: ThemeMode): Record<SemanticRole, string> {
        return Object.fromEntries(
            Object.entries(semanticTones).map(([role, byMode]) => [role, this.#resolve(byMode[mode])]),
        ) as Record<SemanticRole, string>
    }
}
