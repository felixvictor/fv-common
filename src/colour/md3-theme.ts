import { getApcaContrast } from "@/colour/contrast"
import { type HarmonisationStrength, harmoniseOklch, noHarmonisation, warmUpHue } from "@/colour/harmonise"
import {
    type AccentKey,
    accentKeys,
    type FamilyRole,
    md3FamilyTones,
    md3SchemeRoles,
    md3SurfaceRolesWithOnSurface,
    type ModeTones,
    type PaletteKey,
    paletteKeys,
    type SchemeRole,
    type ThemeMode,
    themeModes,
} from "@/colour/md3-roles"
import { md3ScrimHex, md3ShadowHex } from "@/colour/md3-tones"
import { hexToOklch, normaliseHue, type Oklch } from "@/colour/oklch"
import { constantChromaFloor, TonalPalette, type TonalPaletteOptions } from "@/colour/tonal-palette"
import { toneMax } from "@/colour/tone"

export type HarmonisationGroup = "accent" | "extended" | "semantic"
export type SemanticKey = Exclude<AccentKey, BrandKey>
// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------
type BrandKey = "primary" | "secondary" | "tertiary"

const semanticKeys: ReadonlySet<AccentKey> = new Set<SemanticKey>(["error", "info", "success", "warning"])

/** Seeds used when a theme does not set its own semantic colours. `error` is the MD3 baseline error. */
export const md3DefaultSemanticSeeds: Readonly<Record<SemanticKey, string>> = {
    error: "#b3261e",
    info: "#0b57d0",
    success: "#14732a",
    warning: "#8a5800",
}

/**
 * Default pull towards primary. Semantic colours rotate less, so error, warning, success and info keep their meaning.
 * No colour comes closer than 30° in hue to primary through harmonisation; `primary` itself is never harmonised.
 */
export const defaultHarmonisation: Readonly<Record<HarmonisationGroup, HarmonisationStrength>> = {
    accent: { chromaFactor: 0.3, hueFactor: 0.5, maxHueRotation: 15, minHueDistance: 30 },
    extended: { chromaFactor: 0.3, hueFactor: 0.5, maxHueRotation: 15, minHueDistance: 30 },
    semantic: { chromaFactor: 0.2, hueFactor: 0.25, maxHueRotation: 8, minHueDistance: 30 },
}

/** OKLCH chroma of the neutral palette (surfaces, `on-surface`): a light tint of the neutral hue. */
export const defaultNeutralChroma = 0.008
/** OKLCH chroma of the neutral-variant palette (`surface-variant`, outlines): a little more tint than neutral. */
export const defaultNeutralVariantChroma = 0.012
/** Weight of the warm pole in the neutral hue (see {@link warmUpHue}): warm greys that still lean towards primary. */
export const defaultNeutralWarmth = 2
/** Factor on the chroma of all accent palettes after harmonisation; keeps the colours pastel. */
export const defaultChromaScale = 0.8
/** Chroma share kept at tone 0 and 100 by accent palettes; keeps containers (tone 90 / 30) soft. */
export const defaultAccentChromaFloor = 0.45

/**
 * App-specific colour family (e.g. home/away/draw). It gets the four family roles but no exported palette.
 *
 * Without tone overrides it uses the MD3 family tones. Overriding `colour` or `container` without the matching content
 * role picks the content tone (100 or 10 of the same palette) with the higher APCA contrast.
 */
export interface ExtendedColourConfig {
    /** Factor on the chroma of an own seed in place of the theme's `chromaScale`, e.g. 1 for vivid data fills. */
    readonly chromaScale?: number
    /** Own seed, or the (already harmonised) palette of a core colour. */
    readonly seed: string | { readonly from: PaletteKey }
    /** Harmonise an own seed towards primary; default true. */
    readonly shouldHarmonise?: boolean
    readonly tones?: Partial<Readonly<Record<FamilyRole, ModeTones>>>
}

export interface Md3ThemeConfig<TExtended extends string = never> {
    /** Factor on the chroma of all accent palettes and own extended seeds; 1 keeps the seed chroma. */
    readonly chromaScale?: number
    /** App-specific colour families; names are used as theme keys, so write them in kebab-case. */
    readonly extended?: Readonly<Record<TExtended, ExtendedColourConfig>>
    readonly harmonisation?: Partial<Readonly<Record<HarmonisationGroup, HarmonisationStrength>>>
    readonly neutral?: NeutralConfig
    /** Options of the accent palettes; neutral palettes always keep a constant chroma. */
    readonly palette?: TonalPaletteOptions
    /** Overrides MD3 tones of surface, outline and inverse roles, e.g. a darker light-theme background. */
    readonly schemeTones?: Partial<Readonly<Record<SchemeRole, ModeTones>>>
    readonly seeds: Partial<Readonly<Record<SemanticKey, string>>> & Readonly<Record<BrandKey, string>>
}

/**
 * Neutral palettes follow primary at a fixed low chroma. Their hue is the hue of primary (or of `seed`) plus
 * `hueOffset`, pulled towards the warm pole by `warmth`.
 */
export interface NeutralConfig {
    readonly chroma?: number
    readonly hueOffset?: number
    /** Source of the neutral hue in place of primary; its chroma is ignored, so a vivid seed does not tint surfaces. */
    readonly seed?: string
    readonly variantChroma?: number
    /** Weight of the warm pole, see {@link warmUpHue}; 0 keeps the hue of primary. */
    readonly warmth?: number
}

// ---------------------------------------------------------------------------
// Result
// ---------------------------------------------------------------------------
const paletteThemeNames = {
    error: "error",
    info: "info",
    neutral: "neutral",
    neutralVariant: "neutral-variant",
    primary: "primary",
    secondary: "secondary",
    success: "success",
    tertiary: "tertiary",
    warning: "warning",
} as const satisfies Record<PaletteKey, string>

/** Theme keys of a colour family. */
export type FamilyThemeKey<TName extends string> =
    | `${TName}-container`
    | `on-${TName}-container`
    | `on-${TName}`
    | TName
type PaletteThemeName = (typeof paletteThemeNames)[PaletteKey]

type SurfaceRoleWithOnSurface = (typeof md3SurfaceRolesWithOnSurface)[number]

/**
 * Keys of Vuetify's default themes `light` and `dark`, into which Vuetify deep-merges app themes of the same name. They
 * take tones of the own palette; no component uses them, only `bg-*`/`text-*` classes.
 */
const vuetifyDarkenKeys = ["primary", "secondary"] as const satisfies readonly AccentKey[]
type VuetifyDarkenKey = `${(typeof vuetifyDarkenKeys)[number]}-darken-1`
/** Tone step of a Vuetify `*-darken-1` key below its colour, in both modes. */
const vuetifyDarkenToneStep = 10

export interface Md3Theme<TExtended extends string = never> {
    readonly colours: Readonly<Record<ThemeMode, Md3ThemeColours<TExtended>>>
    /** Palettes of the core colours, shared by both modes; extended colours have none. */
    readonly palettes: Readonly<Record<PaletteKey, TonalPalette>>
    readonly variables: Readonly<Record<ThemeMode, VuetifyThemeVariables>>
}

export type Md3ThemeColourKey<TExtended extends string = never> =
    | "scrim"
    | "shadow"
    | FamilyThemeKey<PaletteThemeName | TExtended>
    | SchemeRole
    | VuetifyAliasKey

export type Md3ThemeColours<TExtended extends string = never> = Readonly<Record<Md3ThemeColourKey<TExtended>, string>>

/**
 * Vuetify theme variables derived from the colours; Vuetify keeps its defaults for all others. A type alias, not an
 * interface, so it is assignable to Vuetify's `Record<string, number | string>`.
 */
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type VuetifyThemeVariables = {
    readonly "border-color": string
    readonly "border-opacity": number
    readonly "shadow-color": string
    readonly "theme-code": string
    readonly "theme-kbd": string
    readonly "theme-on-code": string
    readonly "theme-on-dark": string
    readonly "theme-on-kbd": string
    readonly "theme-on-light": string
}

/** Keys Vuetify uses beyond MD3: `background` and `surface-light`, `on-*` for every surface role, `*-darken-1`. */
type VuetifyAliasKey =
    | "background"
    | "on-background"
    | "on-surface-light"
    | "surface-light"
    | `on-${SurfaceRoleWithOnSurface}`
    | VuetifyDarkenKey

/**
 * Component defaults for an MD3 theme. Vuetify draws tooltips and snackbars in `surface-variant`, which in MD3 is a
 * light tinted surface; MD3 uses `inverse-surface` for both.
 */
export const md3VuetifyDefaults = {
    VSnackbar: { color: "inverse-surface" },
    VTooltip: { color: "inverse-surface" },
} as const

/** Borders use `outline-variant` at full opacity, as in MD3. */
export const md3BorderOpacity = 1

// ---------------------------------------------------------------------------
// Generator
// ---------------------------------------------------------------------------
const darkContentTone = 10
const lightContentTone = toneMax
const contentToneCandidates = [lightContentTone, darkContentTone] as const
/** Content colours Vuetify uses for colours without an `on-*` key. */
const neutralOnDarkTone = 99
const neutralOnLightTone = darkContentTone

type FamilyTones = Readonly<Record<FamilyRole, number>>

/** Tone of the content colour (light or dark, same palette) with the higher APCA contrast on the background tone. */
const pickContentTone = (palette: TonalPalette, backgroundTone: number): number => {
    const background = palette.tone(backgroundTone)
    const [bestTone] = contentToneCandidates.toSorted(
        (a, b) => getApcaContrast(palette.tone(b), background) - getApcaContrast(palette.tone(a), background),
    )
    return bestTone ?? lightContentTone
}

const resolveFamilyTones = (
    palette: TonalPalette,
    mode: ThemeMode,
    overrides: ExtendedColourConfig["tones"] = {},
): FamilyTones => {
    const colour = overrides.colour?.[mode] ?? md3FamilyTones.colour[mode]
    const container = overrides.container?.[mode] ?? md3FamilyTones.container[mode]

    return {
        colour,
        container,
        onColour:
            overrides.onColour?.[mode] ??
            (overrides.colour === undefined ? md3FamilyTones.onColour[mode] : pickContentTone(palette, colour)),
        onContainer:
            overrides.onContainer?.[mode] ??
            (overrides.container === undefined
                ? md3FamilyTones.onContainer[mode]
                : pickContentTone(palette, container)),
    }
}

const addFamily = (colours: Record<string, string>, name: string, palette: TonalPalette, tones: FamilyTones): void => {
    colours[name] = palette.tone(tones.colour)
    colours[`on-${name}`] = palette.tone(tones.onColour)
    colours[`${name}-container`] = palette.tone(tones.container)
    colours[`on-${name}-container`] = palette.tone(tones.onContainer)
}

const sortByKey = <T>(record: Record<string, T>): Record<string, T> =>
    Object.fromEntries(Object.entries(record).toSorted(([a], [b]) => a.localeCompare(b)))

const createPalettes = (
    config: Md3ThemeConfig<string>,
    primary: Oklch,
    strengths: Readonly<Record<HarmonisationGroup, HarmonisationStrength>>,
    accentOptions: TonalPaletteOptions,
    chromaScale: number,
): Record<PaletteKey, TonalPalette> => {
    const seeds: Readonly<Record<AccentKey, string>> = { ...md3DefaultSemanticSeeds, ...config.seeds }

    const accentPalettes = Object.fromEntries(
        accentKeys.map((key) => {
            let strength = strengths.accent
            if (key === "primary") strength = noHarmonisation
            else if (semanticKeys.has(key)) strength = strengths.semantic

            const { chroma, hue } = harmoniseOklch(hexToOklch(seeds[key]), primary, strength)
            return [key, new TonalPalette(hue, chroma * chromaScale, accentOptions)]
        }),
    ) as Record<AccentKey, TonalPalette>

    const {
        chroma = defaultNeutralChroma,
        hueOffset = 0,
        seed,
        variantChroma = defaultNeutralVariantChroma,
        warmth = defaultNeutralWarmth,
    } = config.neutral ?? {}
    const neutralHue = warmUpHue(
        normaliseHue((seed === undefined ? primary.hue : hexToOklch(seed).hue) + hueOffset),
        warmth,
    )
    const neutralOptions: TonalPaletteOptions = { chromaFloor: constantChromaFloor }

    return {
        ...accentPalettes,
        neutral: new TonalPalette(neutralHue, chroma, neutralOptions),
        neutralVariant: new TonalPalette(neutralHue, variantChroma, neutralOptions),
    }
}

const createExtendedPalette = (
    { chromaScale: ownChromaScale, seed, shouldHarmonise = true }: ExtendedColourConfig,
    palettes: Readonly<Record<PaletteKey, TonalPalette>>,
    primary: Oklch,
    strength: HarmonisationStrength,
    accentOptions: TonalPaletteOptions,
    chromaScale: number,
): TonalPalette => {
    if (typeof seed !== "string") return palettes[seed.from]

    const oklch = hexToOklch(seed)
    const { chroma, hue } = shouldHarmonise ? harmoniseOklch(oklch, primary, strength) : oklch
    return new TonalPalette(hue, chroma * (ownChromaScale ?? chromaScale), accentOptions)
}

const createColours = (
    mode: ThemeMode,
    config: Md3ThemeConfig<string>,
    palettes: Readonly<Record<PaletteKey, TonalPalette>>,
    extendedPalettes: ReadonlyMap<string, TonalPalette>,
): Record<string, string> => {
    const colours: Record<string, string> = {}

    for (const key of paletteKeys) {
        addFamily(colours, paletteThemeNames[key], palettes[key], resolveFamilyTones(palettes[key], mode))
    }

    const scheme = Object.fromEntries(
        (Object.entries(md3SchemeRoles) as [SchemeRole, (typeof md3SchemeRoles)[SchemeRole]][]).map(([role, spec]) => [
            role,
            palettes[spec.palette].tone(config.schemeTones?.[role]?.[mode] ?? spec.tones[mode]),
        ]),
    ) as Record<SchemeRole, string>
    Object.assign(colours, scheme)

    const onSurface = scheme["on-surface"]
    for (const role of md3SurfaceRolesWithOnSurface) colours[`on-${role}`] = onSurface
    colours["background"] = scheme.surface
    colours["on-background"] = onSurface
    colours["surface-light"] = scheme["surface-container-high"]
    colours["on-surface-light"] = onSurface
    for (const key of vuetifyDarkenKeys) {
        colours[`${key}-darken-1`] = palettes[key].tone(md3FamilyTones.colour[mode] - vuetifyDarkenToneStep)
    }
    colours["scrim"] = md3ScrimHex
    colours["shadow"] = md3ShadowHex

    for (const [name, spec] of Object.entries<ExtendedColourConfig>(config.extended ?? {})) {
        const palette = extendedPalettes.get(name)
        if (palette === undefined) continue
        addFamily(colours, name, palette, resolveFamilyTones(palette, mode, spec.tones))
    }

    return sortByKey(colours)
}

const createVariables = (colours: Md3ThemeColours, neutral: TonalPalette): VuetifyThemeVariables => ({
    "border-color": colours["outline-variant"],
    "border-opacity": md3BorderOpacity,
    "shadow-color": md3ShadowHex,
    "theme-code": colours["surface-container"],
    "theme-kbd": colours["surface-container-highest"],
    "theme-on-code": colours["on-surface"],
    "theme-on-dark": neutral.tone(neutralOnDarkTone),
    "theme-on-kbd": colours["on-surface"],
    "theme-on-light": neutral.tone(neutralOnLightTone),
})

/**
 * Generates a light and a dark MD3 theme for Vuetify from a few seeds.
 *
 * - Every colour is pulled towards primary ({@link defaultHarmonisation}) and scaled to pastel chroma
 *   ({@link defaultChromaScale}); the neutral palettes take the hue of primary, pulled towards warm greys.
 * - Core colours get a tonal palette in OKLCH with absolute tones (CIE L*), shared by both modes; the roles take MD3
 *   tones from it ({@link md3FamilyTones}, {@link md3SchemeRoles}).
 * - Extended colours get the same four family roles, with optional tone overrides, but no exported palette.
 *
 * @throws Error if an extended colour name collides with a core theme key.
 */
export const createMd3Theme = <TExtended extends string = never>(
    config: Md3ThemeConfig<TExtended>,
): Md3Theme<TExtended> => {
    const looseConfig = config as Md3ThemeConfig<string>
    const strengths = { ...defaultHarmonisation, ...config.harmonisation }
    const accentOptions: TonalPaletteOptions = { chromaFloor: defaultAccentChromaFloor, ...config.palette }
    const chromaScale = config.chromaScale ?? defaultChromaScale
    const primary = hexToOklch(config.seeds.primary)

    const palettes = createPalettes(looseConfig, primary, strengths, accentOptions, chromaScale)
    const extendedPalettes = new Map(
        Object.entries<ExtendedColourConfig>(looseConfig.extended ?? {}).map(([name, spec]) => [
            name,
            createExtendedPalette(spec, palettes, primary, strengths.extended, accentOptions, chromaScale),
        ]),
    )

    const coreKeys = new Set(Object.keys(createColours("light", { seeds: config.seeds }, palettes, new Map())))
    for (const name of extendedPalettes.keys()) {
        for (const key of [name, `on-${name}`, `${name}-container`, `on-${name}-container`]) {
            if (coreKeys.has(key)) throw new Error(`Extended colour "${name}" collides with theme key "${key}"`)
        }
    }

    const colours = Object.fromEntries(
        themeModes.map((mode) => [mode, createColours(mode, looseConfig, palettes, extendedPalettes)]),
    ) as Record<ThemeMode, Md3ThemeColours<TExtended>>
    const variables = Object.fromEntries(
        themeModes.map((mode) => [mode, createVariables(colours[mode], palettes.neutral)]),
    ) as Record<ThemeMode, VuetifyThemeVariables>

    return { colours, palettes, variables }
}
