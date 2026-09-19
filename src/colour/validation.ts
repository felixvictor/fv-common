import { getMinColourDistance } from "@/colour/colour-distance"
import { hueDelta } from "@/colour/colour-math"
import {
    apcaMinLcByRole,
    apcaMinLcUiComponent,
    type ApcaTextRole,
    getApcaContrast,
    isMeetingApcaContrast,
} from "@/colour/contrast"
import { okHslColour } from "@/colour/okhsl-colour"
import { type VisionDeficiency } from "@/colour/vision-deficiency"
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

export const validateHueDelta = (
    nameA: string,
    hexA: string,
    nameB: string,
    hexB: string,
    minDelta: number = minSeedHueDelta,
) => {
    const delta = hueDelta(hexA, hexB)
    if (delta < minDelta) {
        console.warn(
            `${nameA} and ${nameB} are only ${round(delta, 1)}° apart in hue (minimum: ${minDelta}°) – their tonal ranges may be indistinguishable`,
        )
    }
}

/** Two theme colours that must stay distinguishable. */
export interface ColourDistanceRule {
    readonly a: string
    readonly b: string
    /** Vision deficiencies checked in addition to normal vision; all if omitted. */
    readonly deficiencies?: readonly VisionDeficiency[]
    /** Minimum ΔE2000. */
    readonly minDistance: number
}

/** Theme keys of a foreground and its background plus the APCA role the pair has to meet. */
export type ThemeTextPair = readonly [foreground: string, background: string, role: ApcaTextRole]

/**
 * Checks the built-in text pairs, the outline and the surface ladder of a theme.
 *
 * @param additionalTextPairs Text pairs of roles that are not part of every theme (e.g. `on-home`/`home`).
 */
export const validateTheme = (
    theme: Record<string, string | undefined>,
    label: string,
    additionalTextPairs: readonly ThemeTextPair[] = [],
) => {
    const textPairs: readonly ThemeTextPair[] = [
        ["on-primary", "primary", "otherContentText"],
        ["on-secondary", "secondary", "otherContentText"],
        ["on-tertiary", "tertiary", "otherContentText"],
        ["on-error", "error", "otherContentText"],
        ["on-success", "success", "otherContentText"],
        ["on-info", "info", "otherContentText"],
        ["on-warning", "warning", "otherContentText"],
        ["on-surface", "surface", "bodyText"],
        ["on-background", "background", "bodyText"],
        ...additionalTextPairs,
    ]

    for (const [fg, bg, role] of textPairs) {
        const fgHex = theme[fg] ?? ""
        const bgHex = theme[bg] ?? ""
        const lc = getApcaContrast(fgHex, bgHex)
        if (!isMeetingApcaContrast(fgHex, bgHex, role)) {
            console.warn(`${label}: ${fg}/${bg} APCA Lc ${lc} < ${apcaMinLcByRole[role]} (role: ${role})`)
        }
    }

    const uiPairs: [string, string][] = [["outline", "surface"]]
    for (const [fg, bg] of uiPairs) {
        const fgHex = theme[fg] ?? ""
        const bgHex = theme[bg] ?? ""
        const lc = getApcaContrast(fgHex, bgHex)
        if (Math.abs(lc) < apcaMinLcUiComponent) {
            console.warn(
                `${label}: ${fg}/${bg} APCA Lc ${lc} < ${apcaMinLcUiComponent} (UI component, bespoke threshold)`,
            )
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

/**
 * Warns if two theme colours are closer than their rule allows, in normal vision or with any of the rule's vision
 * deficiencies. Unlike {@link validateHueDelta} it checks the generated colours, not the seeds: seeds a few degrees
 * apart in hue can still produce tones that look alike.
 */
export const validateColourDistances = (
    theme: Record<string, string | undefined>,
    label: string,
    rules: readonly ColourDistanceRule[],
) => {
    for (const { a, b, deficiencies, minDistance } of rules) {
        const hexA = theme[a]
        const hexB = theme[b]
        if (hexA === undefined || hexB === undefined) {
            console.warn(`${label}: ${a}/${b} cannot be compared, colour missing`)
            continue
        }

        const { deficiency, distance } = getMinColourDistance(hexA, hexB, deficiencies)
        if (distance < minDistance) {
            console.warn(
                `${label}: ${a}/${b} ΔE ${round(distance, 1)} < ${minDistance} (${deficiency ?? "normal vision"})`,
            )
        }
    }
}
