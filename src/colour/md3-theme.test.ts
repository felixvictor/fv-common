import { describe, expect, it } from "vitest"

import { getContrastRatio } from "./contrast.js"
import { harmoniseChroma, warmUpHue } from "./harmonise.js"
import { accentKeys, md3FamilyTones, themeModes } from "./md3-roles.js"
import { createMd3Theme, defaultChromaScale, defaultNeutralWarmth, type Md3ThemeConfig } from "./md3-theme.js"
import { getHueDifference, hexToOklch } from "./oklch.js"
import { getTone } from "./tone.js"
import { getThemeTextPairs } from "./validation.js"

const seeds = { primary: "#3a6c9a", secondary: "#4b798c", tertiary: "#7e7246" }
const wcagTextMin = 4.5
const toneTolerance = 0.5

const config = {
    extended: {
        away: { seed: { from: "tertiary" }, tones: { colour: { dark: 50, light: 50 } } },
        brand: { seed: "#d0006f" },
        home: { seed: { from: "secondary" }, tones: { colour: { dark: 50, light: 75 } } },
        muted: { seed: "#4b798c", shouldHarmonise: false, tones: { colour: { dark: 50, light: 50 } } },
        vivid: { chromaScale: 1, seed: "#4b798c", shouldHarmonise: false, tones: { colour: { dark: 50, light: 50 } } },
    },
    seeds,
} as const satisfies Md3ThemeConfig<"away" | "brand" | "home" | "muted" | "vivid">

describe("createMd3Theme", () => {
    const theme = createMd3Theme(config)

    it("provides the MD3 roles and the keys Vuetify components use", () => {
        for (const mode of themeModes) {
            const colours = theme.colours[mode]

            const variables = theme.variables[mode]

            expect(colours.background).toBe(colours.surface)
            expect(colours["surface-light"]).toBe(colours["surface-container-high"])
            expect(colours["on-inverse-surface"]).toBeDefined()
            expect(Object.keys(colours)).not.toContain("on-surface-container")
            expect([variables["theme-on-dark"], variables["theme-on-light"]].toSorted()).toEqual(
                [colours["on-inverse-surface"], colours["on-surface"]].toSorted(),
            )
            expect(getTone(variables["theme-on-light"])).toBeLessThan(getTone(variables["theme-on-dark"]))
            expect(getTone(colours["primary-darken-1"])).toBeLessThan(getTone(colours.primary))
            expect(colours["neutral-variant-container"]).toBeDefined()
            expect(variables["border-color"]).toBe(colours["on-surface"])
            expect(Object.keys(variables)).not.toContain("border-opacity")
        }
    })

    it("meets 4.5:1 for every core family in both modes", () => {
        for (const mode of themeModes) {
            const colours = theme.colours[mode]

            for (const key of accentKeys) {
                expect(getContrastRatio(colours[`on-${key}`], colours[key])).toBeGreaterThanOrEqual(wcagTextMin)
                expect(
                    getContrastRatio(colours[`on-${key}-container`], colours[`${key}-container`]),
                ).toBeGreaterThanOrEqual(wcagTextMin)
            }
        }
    })

    it("takes the MD3 tones for core roles", () => {
        expect(getTone(theme.colours.light.primary)).toBeCloseTo(md3FamilyTones.colour.light, 0)
        expect(getTone(theme.colours.dark["primary-container"])).toBeCloseTo(md3FamilyTones.container.dark, 0)
        expect(theme.colours.light["on-primary"]).toBe("#ffffff")
    })

    it("derives the neutral palettes from the hue of primary, pulled towards warm greys", () => {
        const primaryHue = hexToOklch(seeds.primary).hue

        expect(theme.palettes.neutral.hue).toBeCloseTo(warmUpHue(primaryHue, defaultNeutralWarmth), 6)
        expect(createMd3Theme({ neutral: { warmth: 0 }, seeds }).palettes.neutral.hue).toBeCloseTo(primaryHue, 6)
        expect(theme.palettes.neutralVariant.chroma).toBeGreaterThan(theme.palettes.neutral.chroma)
    })

    it("keeps colours near primary apart from it", () => {
        const primaryHue = hexToOklch(seeds.primary).hue
        const secondary = hexToOklch(seeds.secondary)

        expect(theme.palettes.secondary.hue).toBeCloseTo(secondary.hue, 6)
        expect(theme.palettes.secondary.chroma).toBeCloseTo(secondary.chroma * defaultChromaScale, 6)
        expect(Math.abs(getHueDifference(theme.palettes.secondary.hue, primaryHue))).toBeLessThan(30)
    })

    it("pulls other colours towards primary, semantic colours less", () => {
        const primaryHue = hexToOklch(seeds.primary).hue
        const distanceToPrimary = (hue: number) => Math.abs(getHueDifference(hue, primaryHue))
        const errorRotation = Math.abs(getHueDifference(hexToOklch("#b3261e").hue, theme.palettes.error.hue))

        expect(distanceToPrimary(theme.palettes.tertiary.hue)).toBeLessThan(
            distanceToPrimary(hexToOklch(seeds.tertiary).hue),
        )
        expect(errorRotation).toBeLessThanOrEqual(8 + 1e-9)
        expect(theme.palettes.error.chroma).toBeCloseTo(
            harmoniseChroma(hexToOklch("#b3261e").chroma, hexToOklch(seeds.primary).chroma, {
                chromaFactor: 0.2,
                hueFactor: 0,
                maxHueRotation: 0,
                minHueDistance: 0,
            }) * defaultChromaScale,
            6,
        )
    })

    it("builds extended families from core palettes with tone overrides", () => {
        expect(theme.colours.light.home).toBe(theme.palettes.secondary.tone(75))
        expect(theme.colours.dark.away).toBe(theme.palettes.tertiary.tone(50))
        expect(theme.colours.light["home-container"]).toBe(
            theme.palettes.secondary.tone(md3FamilyTones.container.light),
        )
        expect(getContrastRatio(theme.colours.light["on-brand"], theme.colours.light.brand)).toBeGreaterThanOrEqual(
            wcagTextMin,
        )
    })

    it("scales own extended seeds by their own chroma factor", () => {
        const seedChroma = hexToOklch("#4b798c").chroma
        const chromaTolerance = 0.003

        expect(Math.abs(hexToOklch(theme.colours.light.vivid).chroma - seedChroma)).toBeLessThan(chromaTolerance)
        expect(Math.abs(hexToOklch(theme.colours.light.muted).chroma - seedChroma * defaultChromaScale)).toBeLessThan(
            chromaTolerance,
        )
    })

    it("picks the content colour with the higher contrast for overridden tones", () => {
        expect(getTone(theme.colours.light["on-home"])).toBeCloseTo(10, 0)
        expect(theme.colours.dark["on-away"]).toBe("#ffffff")
    })

    it("applies scheme tone overrides and neutral options", () => {
        const custom = createMd3Theme({
            chromaScale: 1,
            neutral: { hueOffset: 30, seed: "#7e7246", warmth: 0 },
            schemeTones: { surface: { dark: 12, light: 95 } },
            seeds,
        })

        expect(Math.abs(getTone(custom.colours.light.surface) - 95)).toBeLessThan(toneTolerance)
        expect(Math.abs(getTone(custom.colours.dark.background) - 12)).toBeLessThan(toneTolerance)
        expect(getHueDifference(hexToOklch("#7e7246").hue, custom.palettes.neutral.hue)).toBeCloseTo(30, 6)
        expect(custom.palettes.secondary.chroma).toBeCloseTo(hexToOklch(seeds.secondary).chroma, 6)
    })

    it("rejects extended names that collide with core keys", () => {
        expect(() => createMd3Theme({ extended: { surface: { seed: "#ff0000" } }, seeds })).toThrow(/collides/)
    })

    it("checks every content colour against its background", () => {
        const pairs = getThemeTextPairs(theme.colours.light, [["on-home", "home", "largeFluentText"]])

        expect(pairs).toContainEqual(["on-surface", "surface-container-high", "bodyText"])
        expect(pairs).toContainEqual(["on-surface", "background", "bodyText"])
        expect(pairs).toContainEqual(["on-primary", "primary", "otherContentText"])
        expect(pairs).toContainEqual(["on-primary-container", "primary-container", "otherContentText"])
        expect(pairs).toContainEqual(["on-home", "home", "largeFluentText"])
    })
})
