import { clamp } from "@/common"
import Color, { type Coords } from "colorjs.io"
import { deltas } from "colorjs.io/fn"

/**
 * Polar OKLab coordinates.
 *
 * Chroma is absolute: equal chroma means similar colourfulness across hues, so chroma is comparable and blendable
 * between colours.
 */
export interface Oklch {
    /** 0 for grey; about 0.37 at most within sRGB. */
    readonly chroma: number
    /** Degrees, 0–360; 0 for grey. */
    readonly hue: number
    /** 0 (black) to 1 (white). */
    readonly lightness: number
}

/**
 * A colour in OKLCH, the working space of the theme palettes, backed by colorjs.io.
 *
 * Output (`hex`, `tone`) is mapped into sRGB by lowering chroma until the colour fits, with lightness and hue exactly
 * kept; this keeps tone searches monotonic. The tone is CIE L* with D65 white, derived from the relative luminance WCAG
 * contrast is based on.
 */
export class okLchColour implements Oklch {
    static readonly chromaMin = 0
    static readonly colorSpace = "oklch"
    /** Gamut mapping along OKLCH chroma … */
    static readonly gamutMappingMethod = "oklch.c"
    /** … without a just-noticeable-difference tolerance, which would shift lightness and hue by up to that amount. */
    static readonly gamutMappingTolerance = 0
    /** Vuetify themes and SVG files take sRGB. */
    static readonly gamutSpace = "srgb"
    static readonly hexFormat = "hex"
    static readonly hueMax = 360
    static readonly hueMin = 0
    static readonly lightnessMax = 1
    static readonly lightnessMin = 0
    /** Coordinate whose value is the tone. */
    static readonly toneCoordinate = "lab-d65.l"

    get chroma(): number {
        return (this.#colour.c as null | number | undefined) ?? okLchColour.chromaMin
    }

    set chroma(value: number | string) {
        this.#safeSet("chroma", "c", value, (v) => Math.max(v, okLchColour.chromaMin))
    }

    get colourObject(): Color {
        return this.#colour
    }

    /** `#rrggbb` of the colour, mapped into sRGB. */
    get hex(): string {
        return this.#mapped().to(okLchColour.gamutSpace).toString({ collapse: false, format: okLchColour.hexFormat })
    }

    /** Hue in degrees; colorjs.io has no hue for greys, they get 0. */
    get hue(): number {
        return (this.#colour.h as null | number | undefined) ?? okLchColour.hueMin
    }

    set hue(value: number | string) {
        this.#safeSet("hue", "h", value, (v) => okLchColour.normaliseHue(v))
    }

    get isInGamut(): boolean {
        return this.#colour.inGamut(okLchColour.gamutSpace)
    }

    get lightness(): number {
        return (this.#colour.l as null | number | undefined) ?? okLchColour.lightnessMin
    }

    set lightness(value: number | string) {
        this.#safeSet("lightness", "l", value, (v) => clamp(v, okLchColour.lightnessMin, okLchColour.lightnessMax))
    }

    /** CIE L* (0–100) of the colour, mapped into sRGB. */
    get tone(): number {
        return this.#mapped().get(okLchColour.toneCoordinate)
    }

    readonly #colour: Color

    /** Accepts any CSS colour, a colorjs.io colour, or OKLCH coordinates `[lightness, chroma, hue]`. */
    constructor(argument: Color | Coords | string) {
        this.#colour =
            typeof argument === "string" || argument instanceof Color
                ? new Color(argument).to(okLchColour.colorSpace)
                : new Color({ coords: argument, space: okLchColour.colorSpace })
    }

    /** Signed shortest rotation in degrees from `fromHue` to `toHue`, in the range −180 < difference ≤ 180. */
    static hueDifference(fromHue: number, toHue: number): number {
        const halfTurn = okLchColour.hueMax / 2
        const difference = okLchColour.normaliseHue(toHue - fromHue)
        return difference > halfTurn ? difference - okLchColour.hueMax : difference
    }

    /** Hue distance in degrees (0–180) between two colours. */
    static hueDistance(colourA: okLchColour, colourB: okLchColour): number {
        const [, , hueDelta] = deltas(colourA.colourObject, colourB.colourObject, {
            space: okLchColour.colorSpace,
        }).coords
        return Math.abs(hueDelta ?? 0)
    }

    /** Normalises a hue to 0 ≤ hue < 360. */
    static normaliseHue(hue: number): number {
        return ((hue % okLchColour.hueMax) + okLchColour.hueMax) % okLchColour.hueMax
    }

    clone(): okLchColour {
        return new okLchColour(this.#colour)
    }

    /** Copy mapped into sRGB. */
    toGamut(): okLchColour {
        return new okLchColour(this.#mapped())
    }

    toString(): string {
        return this.hex
    }

    #mapped(): Color {
        return this.#colour.clone().toGamut({
            jnd: okLchColour.gamutMappingTolerance,
            method: okLchColour.gamutMappingMethod,
            space: okLchColour.gamutSpace,
        })
    }

    #safeSet(label: string, property: "c" | "h" | "l", value: number | string, transform: (v: number) => number): void {
        const parsed = Number(value)

        if (Number.isNaN(parsed)) {
            console.warn(
                `${okLchColour.name}: Cannot set ${label} to invalid value "${value}" (${parsed}), ` +
                    `keeping current value "${this.#colour[property]}"`,
            )
            return
        }

        this.#colour[property] = transform(parsed)
    }
}
