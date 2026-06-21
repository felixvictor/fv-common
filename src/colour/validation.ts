import { hueDelta } from "@/colour/colour-math"
import { getContrastRatio, wcagTextMinRatio, wcagUiMinRatio } from "@/colour/contrast"
import { okHslColour } from "@/colour/okhsl-colour"
import { round } from "@/format/number"

export const seedLightnessMin = 0.35
export const seedLightnessMax = 0.65
export const seedChromaMin = 0.38
export const neutralChromaMax = 0.15
export const minSeedHueDelta = 5
export const minSurfaceLightnessDelta = 0.02 // minimum ΔL between adjacent surface levels

export const validateSeed = (name: string, hex: string, options: { neutral?: boolean } = {}) => {
    const c = new okHslColour(hex)
    const l = c.l
    const s = c.s
    if (l < seedLightnessMin || l > seedLightnessMax) {
        console.warn(
            `${name} (${hex}): lightness ${round(l, 2)} outside ideal range ${seedLightnessMin}–${seedLightnessMax} – generated tones may lack contrast`,
        )
    }
    if (options.neutral && s > neutralChromaMax) {
        console.warn(
            `${name} (${hex}): saturation ${round(s, 2)} > ${neutralChromaMax} – neutral seeds should be near-grey`,
        )
    }
    if (!options.neutral && s < seedChromaMin) {
        console.warn(
            `${name} (${hex}): saturation ${round(s, 2)} < ${seedChromaMin} – low chroma may produce washed-out tones`,
        )
    }
}

export const validateHueDelta = (nameA: string, hexA: string, nameB: string, hexB: string) => {
    const delta = hueDelta(hexA, hexB)
    if (delta < minSeedHueDelta) {
        console.warn(
            `${nameA} and ${nameB} are only ${round(delta, 1)}° apart in hue – their tonal ranges may be indistinguishable`,
        )
    }
}

export const validateTheme = (theme: Record<string, string | undefined>, label: string) => {
    const textPairs: [string, string][] = [
        ["on-primary", "primary"],
        ["on-secondary", "secondary"],
        ["on-tertiary", "tertiary"],
        ["on-error", "error"],
        ["on-success", "success"],
        ["on-info", "info"],
        ["on-warning", "warning"],
        ["on-surface", "surface"],
        ["on-background", "background"],
    ]

    for (const [fg, bg] of textPairs) {
        const ratio = getContrastRatio(theme[fg] ?? "", theme[bg] ?? "")
        if (ratio < wcagTextMinRatio) {
            console.warn(`${label}: ${fg}/${bg} contrast ${ratio} < ${wcagTextMinRatio} (WCAG AA)`)
        }
    }

    const uiPairs: [string, string][] = [
        ["outline", "surface"],
        ["outline-variant", "surface"],
    ]
    for (const [fg, bg] of uiPairs) {
        const ratio = getContrastRatio(theme[fg] ?? "", theme[bg] ?? "")
        if (ratio < wcagUiMinRatio) {
            console.warn(`${label}: ${fg}/${bg} contrast ${ratio} < ${wcagUiMinRatio} (WCAG AA non-text)`)
        }
    }

    const surfaceLevels: [string, string][] = [
        ["surface-bright", "surface"],
        ["surface", "surface-light"],
        ["surface-light", "surface-variant"],
    ]
    for (const [a, b] of surfaceLevels) {
        const lA = new okHslColour(theme[a] ?? "").l
        const lB = new okHslColour(theme[b] ?? "").l
        const delta = Math.abs(lA - lB)
        if (delta < minSurfaceLightnessDelta) {
            console.warn(
                `${label}: ${a} and ${b} are too similar (ΔL=${round(delta, 3)} < ${minSurfaceLightnessDelta}) – surfaces may be indistinguishable`,
            )
        }
    }
}
