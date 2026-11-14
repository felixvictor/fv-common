import { afterEach, describe, expect, it, vi } from "vitest"

import { createMd3Theme } from "./md3-theme.js"
import { surfaceLadder, validateSurfaceLadder, validateTheme } from "./validation.js"

const seeds = { primary: "#9c7646", secondary: "#426082", tertiary: "#6c6c3b" }

describe("validateSurfaceLadder", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined)

    afterEach(() => {
        warn.mockClear()
    })

    it("accepts the MD3 surface tones in both modes", () => {
        const theme = createMd3Theme({ seeds })

        validateSurfaceLadder(theme.colours.light, "light")
        validateSurfaceLadder(theme.colours.dark, "dark")

        expect(warn).not.toHaveBeenCalled()
    })

    it("warns when a single overridden level steps out of the ladder", () => {
        const theme = createMd3Theme({ schemeTones: { surface: { dark: 12, light: 95 } }, seeds })

        validateSurfaceLadder(theme.colours.dark, "dark")
        expect(warn).toHaveBeenCalledTimes(1)
        expect(warn.mock.calls[0]?.[0]).toMatch(
            /dark: surface-container-low .* breaks the surface ladder after surface/,
        )

        warn.mockClear()
        validateSurfaceLadder(theme.colours.light, "light")
        expect(warn).toHaveBeenCalledTimes(1)
        expect(warn.mock.calls[0]?.[0]).toMatch(
            /light: surface-container-low .* breaks the surface ladder after surface/,
        )
    })

    it("accepts a ladder shifted as a whole", () => {
        const shift = 6
        const theme = createMd3Theme({
            schemeTones: {
                surface: { dark: 6 + shift, light: 98 - shift },
                "surface-container": { dark: 12 + shift, light: 94 - shift },
                "surface-container-high": { dark: 17 + shift, light: 92 - shift },
                "surface-container-highest": { dark: 22 + shift, light: 90 - shift },
                "surface-container-low": { dark: 10 + shift, light: 96 - shift },
                "surface-container-lowest": { dark: 4 + shift, light: 100 - shift },
            },
            seeds,
        })

        validateSurfaceLadder(theme.colours.dark, "dark")
        validateSurfaceLadder(theme.colours.light, "light")

        expect(warn).not.toHaveBeenCalled()
    })

    it("skips levels missing from the theme", () => {
        validateSurfaceLadder({ surface: "#ffffff" }, "partial")
        validateSurfaceLadder({}, "empty")

        expect(warn).not.toHaveBeenCalled()
        expect(surfaceLadder).toContain("surface")
    })

    it("runs as part of validateTheme", () => {
        const theme = createMd3Theme({ schemeTones: { surface: { dark: 12, light: 98 } }, seeds })

        validateTheme(theme.colours.dark, "dark")

        expect(warn.mock.calls.some(([message]) => String(message).includes("breaks the surface ladder"))).toBe(true)
    })
})
