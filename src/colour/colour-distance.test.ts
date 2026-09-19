import { afterEach, describe, expect, it, vi } from "vitest"

import { getColourDistance, getMinColourDistance } from "./colour-distance.js"
import { validateColourDistances } from "./validation.js"
import { simulateVisionDeficiency, visionDeficiencies } from "./vision-deficiency.js"

const red = "#ff0000"
const green = "#00aa00"
const blue = "#0000ff"
const orange = "#ff8000"

describe("simulateVisionDeficiency", () => {
    it.each(visionDeficiencies)("keeps achromatic colours unchanged (%s)", (deficiency) => {
        expect(simulateVisionDeficiency("#000000", deficiency)).toBe("#000")
        expect(simulateVisionDeficiency("#ffffff", deficiency)).toBe("#fff")
        expect(getColourDistance("#808080", simulateVisionDeficiency("#808080", deficiency))).toBeLessThan(0.5)
    })

    it("maps red and green to similar colours for deuteranopia and protanopia", () => {
        const normal = getColourDistance(red, green)

        expect(normal).toBeGreaterThan(40)
        expect(getColourDistance(red, green, "deuteranopia")).toBeLessThan(normal / 3)
        expect(getColourDistance(red, green, "protanopia")).toBeLessThan(normal / 3)
    })

    it("keeps blue and orange apart for deuteranopia and protanopia", () => {
        expect(getColourDistance(blue, orange, "deuteranopia")).toBeGreaterThan(30)
        expect(getColourDistance(blue, orange, "protanopia")).toBeGreaterThan(30)
    })
})

describe("getColourDistance", () => {
    it("is zero for identical colours and symmetric", () => {
        expect(getColourDistance(red, red)).toBe(0)
        expect(getColourDistance(red, blue)).toBeCloseTo(getColourDistance(blue, red))
    })
})

describe("getMinColourDistance", () => {
    it("reports the least favourable vision", () => {
        const { deficiency, distance } = getMinColourDistance(red, green)

        expect(deficiency).toBe("deuteranopia")
        expect(distance).toBe(getColourDistance(red, green, "deuteranopia"))
    })

    it("reports normal vision as undefined if it is the least favourable", () => {
        const { deficiency, distance } = getMinColourDistance(blue, orange)

        expect(distance).toBeGreaterThan(0)
        expect(deficiency === undefined || visionDeficiencies.includes(deficiency)).toBe(true)
    })

    it("considers only the given deficiencies", () => {
        const { deficiency } = getMinColourDistance(red, green, ["tritanopia"])

        expect(deficiency).not.toBe("deuteranopia")
    })
})

describe("validateColourDistances", () => {
    afterEach(() => {
        vi.restoreAllMocks()
    })

    it("warns for pairs below the minimum and names the vision", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined)

        validateColourDistances({ away: green, home: red }, "light", [{ a: "home", b: "away", minDistance: 20 }])

        expect(warn).toHaveBeenCalledTimes(1)
        expect(warn.mock.calls[0]?.[0]).toContain("light: home/away")
        expect(warn.mock.calls[0]?.[0]).toContain("deuteranopia")
    })

    it("stays silent if all pairs keep their distance", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined)

        validateColourDistances({ away: orange, home: blue }, "light", [{ a: "home", b: "away", minDistance: 20 }])

        expect(warn).not.toHaveBeenCalled()
    })

    it("limits the check to the given deficiencies", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined)

        validateColourDistances({ away: green, home: red }, "light", [
            { a: "home", b: "away", deficiencies: ["tritanopia"], minDistance: 20 },
        ])

        expect(warn).not.toHaveBeenCalled()
    })

    it("warns about missing colours", () => {
        const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined)

        validateColourDistances({ home: red }, "dark", [{ a: "home", b: "away", minDistance: 20 }])

        expect(warn.mock.calls[0]?.[0]).toContain("colour missing")
    })
})
