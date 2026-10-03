import { getMinColourDistance } from "@/colour/colour-distance"
import {
    apcaMinLcByRole,
    apcaMinLcUiComponent,
    type ApcaTextRole,
    getApcaContrast,
    isMeetingApcaContrast,
} from "@/colour/contrast"
import { getHueDistance, hexToOklch } from "@/colour/oklch"
import { getTone } from "@/colour/tone"
import { type VisionDeficiency } from "@/colour/vision-deficiency"
import { round } from "@/format/number"

/** OKLCH chroma below which an accent seed yields washed-out, almost grey tones. */
export const seedChromaMin = 0.03
export const minSeedHueDelta = 5
/** Minimum tone difference (CIE L*) between adjacent surface levels; MD3 steps by 2, the rest absorbs hex rounding. */
export const minSurfaceToneDelta = 1.5

/** Warns if an accent seed is too grey to carry a colour family. Lightness does not matter: palettes use hue and chroma. */
export const validateSeed = (name: string, hex: string) => {
    const { chroma } = hexToOklch(hex)
    if (chroma < seedChromaMin) {
        console.warn(
            `${name} (${hex}): chroma ${round(chroma, 3)} < ${seedChromaMin} – the colour family may look washed out`,
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
    const delta = getHueDistance(hexA, hexB)
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
 * Backgrounds whose content colour is body text: background and surfaces. Colours, containers and `surface-variant`
 * carry labels and icons (chips, badges, buttons, fields).
 */
const isBodyTextBackground = (key: string): boolean =>
    key === "background" || key === "inverse-surface" || (key.startsWith("surface") && key !== "surface-variant")

const pairKey = (foreground: string, background: string) => `${foreground}|${background}`

/**
 * Text pairs of a theme: every `on-X` key with its background `X`, and every surface without an own `on-*` key with
 * `on-surface`. Surfaces carry body text, all other backgrounds labels and icons (`otherContentText`). Additional pairs
 * replace the role of a derived pair or add new pairs.
 */
export const getThemeTextPairs = (
    theme: Readonly<Record<string, string | undefined>>,
    additionalTextPairs: readonly ThemeTextPair[] = [],
): ThemeTextPair[] => {
    const pairs = new Map<string, ThemeTextPair>()
    const contentPrefix = "on-"

    for (const foreground of Object.keys(theme)) {
        if (!foreground.startsWith(contentPrefix)) continue
        const background = foreground.slice(contentPrefix.length)
        if (theme[background] === undefined) continue
        const role: ApcaTextRole = isBodyTextBackground(background) ? "bodyText" : "otherContentText"
        pairs.set(pairKey(foreground, background), [foreground, background, role])
    }

    const onSurface = "on-surface"
    if (theme[onSurface] !== undefined) {
        for (const background of Object.keys(theme)) {
            if (!isBodyTextBackground(background) || theme[`${contentPrefix}${background}`] !== undefined) continue
            pairs.set(pairKey(onSurface, background), [onSurface, background, "bodyText"])
        }
    }

    for (const pair of additionalTextPairs) pairs.set(pairKey(pair[0], pair[1]), pair)

    return [...pairs.values()]
}

/**
 * Checks the text pairs (see {@link getThemeTextPairs}), the outline and the surface ladder of a theme.
 *
 * @param additionalTextPairs Pairs with a different APCA role (e.g. large labels on `home`) or pairs without `on-` key.
 */
export const validateTheme = (
    theme: Readonly<Record<string, string | undefined>>,
    label: string,
    additionalTextPairs: readonly ThemeTextPair[] = [],
) => {
    for (const [fg, bg, role] of getThemeTextPairs(theme, additionalTextPairs)) {
        const fgHex = theme[fg] ?? ""
        const bgHex = theme[bg] ?? ""
        const lc = getApcaContrast(fgHex, bgHex)
        if (!isMeetingApcaContrast(fgHex, bgHex, role)) {
            console.warn(
                `${label}: ${fg}/${bg} APCA Lc ${lc} outside the range for ${role} (min ${apcaMinLcByRole[role]})`,
            )
        }
    }

    const uiPairs: [string, string][] = [["outline", "surface"]]
    for (const [fg, bg] of uiPairs) {
        const lc = getApcaContrast(theme[fg] ?? "", theme[bg] ?? "")
        if (lc < apcaMinLcUiComponent) {
            console.warn(
                `${label}: ${fg}/${bg} APCA Lc ${lc} < ${apcaMinLcUiComponent} (UI component, bespoke threshold)`,
            )
        }
    }

    const surfaceLevels: [string, string][] = [
        ["surface", "surface-light"],
        ["surface-light", "surface-variant"],
    ]
    for (const [a, b] of surfaceLevels) {
        const delta = Math.abs(getTone(theme[a] ?? "") - getTone(theme[b] ?? ""))
        if (delta < minSurfaceToneDelta) {
            console.warn(
                `${label}: ${a} and ${b} are too similar (ΔL* ${round(delta, 1)} < ${minSurfaceToneDelta}) – surfaces may be indistinguishable`,
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
