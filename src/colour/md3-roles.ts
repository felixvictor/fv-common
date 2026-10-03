export type ThemeMode = "dark" | "light"
export const themeModes: readonly ThemeMode[] = ["light", "dark"]

/** Palettes of an MD3 theme: the accent colours plus the two neutral palettes for surfaces and outlines. */
export type AccentKey = "error" | "info" | "primary" | "secondary" | "success" | "tertiary" | "warning"

/** A tone (CIE L*) per theme mode. */
export type ModeTones = Readonly<Record<ThemeMode, number>>
export type NeutralKey = "neutral" | "neutralVariant"
export type PaletteKey = AccentKey | NeutralKey

export const accentKeys: readonly AccentKey[] = [
    "primary",
    "secondary",
    "tertiary",
    "error",
    "info",
    "success",
    "warning",
]
export const paletteKeys: readonly PaletteKey[] = [...accentKeys, "neutral", "neutralVariant"]

/** Roles of a colour family: the colour, its container, and the content colours on both. */
export type FamilyRole = "colour" | "container" | "onColour" | "onContainer"

/**
 * MD3 tones of a colour family (colour spec 2021). Within each mode, a role and its content colour are at least 60
 * tones apart, which guarantees a WCAG contrast of at least 4.5:1 for any hue.
 */
export const md3FamilyTones = {
    colour: { dark: 80, light: 40 },
    container: { dark: 30, light: 90 },
    onColour: { dark: 20, light: 100 },
    onContainer: { dark: 90, light: 10 },
} as const satisfies Record<FamilyRole, ModeTones>

export interface SchemeRoleSpec {
    readonly palette: PaletteKey
    readonly tones: ModeTones
}

/**
 * MD3 surface, outline and inverse roles (colour spec 2021), keyed by their theme name.
 *
 * MD3 names the content colour of `inverse-surface` "inverse-on-surface"; here it is `on-inverse-surface` so Vuetify
 * pairs it with `inverse-surface` for `bg-inverse-surface` and `color="inverse-surface"`.
 */
export const md3SchemeRoles = {
    "inverse-primary": { palette: "primary", tones: { dark: 40, light: 80 } },
    "inverse-surface": { palette: "neutral", tones: { dark: 90, light: 20 } },
    "on-inverse-surface": { palette: "neutral", tones: { dark: 20, light: 95 } },
    "on-surface": { palette: "neutral", tones: { dark: 90, light: 10 } },
    "on-surface-variant": { palette: "neutralVariant", tones: { dark: 80, light: 30 } },
    outline: { palette: "neutralVariant", tones: { dark: 60, light: 50 } },
    "outline-variant": { palette: "neutralVariant", tones: { dark: 30, light: 80 } },
    surface: { palette: "neutral", tones: { dark: 6, light: 98 } },
    "surface-bright": { palette: "neutral", tones: { dark: 24, light: 98 } },
    "surface-container": { palette: "neutral", tones: { dark: 12, light: 94 } },
    "surface-container-high": { palette: "neutral", tones: { dark: 17, light: 92 } },
    "surface-container-highest": { palette: "neutral", tones: { dark: 22, light: 90 } },
    "surface-container-low": { palette: "neutral", tones: { dark: 10, light: 96 } },
    "surface-container-lowest": { palette: "neutral", tones: { dark: 4, light: 100 } },
    "surface-dim": { palette: "neutral", tones: { dark: 6, light: 87 } },
    "surface-variant": { palette: "neutralVariant", tones: { dark: 30, light: 90 } },
} as const satisfies Record<string, SchemeRoleSpec>

export type SchemeRole = keyof typeof md3SchemeRoles

/** Surface roles whose content colour is `on-surface`. */
export const md3SurfaceRolesWithOnSurface = [
    "surface",
    "surface-bright",
    "surface-container",
    "surface-container-high",
    "surface-container-highest",
    "surface-container-low",
    "surface-container-lowest",
    "surface-dim",
] as const satisfies readonly SchemeRole[]
