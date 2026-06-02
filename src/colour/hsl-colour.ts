import Color, { type Coords } from "colorjs.io"

import { clamp } from "../common.js"

export class HslColour {
    static readonly colorSpace = "okhsl"
    static readonly hexFormat = "hex"
    static readonly hueMax = 360
    static readonly hueMin = 0
    static readonly lightnessMax = 100
    static readonly lightnessMin = 0
    static readonly outputColorSpace = "srgb"
    static readonly saturationMax = 100
    static readonly saturationMin = 0

    get colourObject(): Color {
        return this.#colour
    }

    get h(): number {
        return (this.#colour.h as number | undefined) ?? HslColour.hueMin
    }

    set h(value: number | string) {
        const h = Number(value)
        if (Number.isNaN(h)) {
            console.warn(
                `${HslColour.name}: Cannot set hue to invalid value "${value}" (${h}), ` +
                    `keeping current value "${this.#colour.h}"`,
            )
            return
        }
        this.#colour.h = ((h % HslColour.hueMax) + HslColour.hueMax) % HslColour.hueMax
    }

    get hex(): string {
        return this.#colour.to(HslColour.outputColorSpace).toString({ format: HslColour.hexFormat })
    }

    get l(): number {
        return (this.#colour.l as number | undefined) ?? HslColour.lightnessMin
    }

    set l(value: number | string) {
        const l = Number(value)
        if (Number.isNaN(l)) {
            console.warn(
                `${HslColour.name}: Cannot set lightness to invalid value "${value}" (${l}), ` +
                    `keeping current value "${this.#colour.l}"`,
            )
            return
        }
        this.#colour.l = clamp(l, HslColour.lightnessMin, HslColour.lightnessMax)
    }

    get s(): number {
        return (this.#colour.s as number | undefined) ?? HslColour.saturationMin
    }

    set s(value: number | string) {
        const s = Number(value)
        if (Number.isNaN(s)) {
            console.warn(
                `${HslColour.name}: Cannot set saturation to invalid value "${value}" (${s}), ` +
                    `keeping current value "${this.#colour.s}"`,
            )
            return
        }
        this.#colour.s = clamp(s, HslColour.saturationMin, HslColour.saturationMax)
    }

    readonly #colour: Color

    constructor(argument: Color | Coords | string) {
        if (typeof argument === "string") {
            this.#colour = new Color(argument).to(HslColour.colorSpace)
        } else if (argument instanceof Color) {
            this.#colour = new Color(argument).to(HslColour.colorSpace)
        } else {
            this.#colour = new Color({ coords: argument, space: HslColour.colorSpace })
        }
    }

    static mix(color1: HslColour, color2: HslColour, weight: number): HslColour {
        const mix = Color.mix(color1.colourObject, color2.colourObject, weight, {
            outputSpace: HslColour.colorSpace,
            space: HslColour.colorSpace,
        })
        return new HslColour(mix)
    }

    clone(): HslColour {
        return new HslColour(this.#colour)
    }

    toString(): string {
        return this.hex
    }
}
