import Color, { type Coords } from "colorjs.io"

import { lightnessMax, lightnessMin } from "@/colour/colour-math"
import { clamp } from "@/common"

export class okHslColour {
    static readonly colorSpace = "okhsl"
    static readonly hexFormat = "hex"
    static readonly hueMax = 360
    static readonly hueMin = 0
    static readonly outputColorSpace = "srgb"
    static readonly saturationMax = 1
    static readonly saturationMin = 0

    get colourObject(): Color {
        return this.#colour
    }

    get h(): number {
        return (this.#colour.h as number | undefined) ?? okHslColour.hueMin
    }

    set h(value: number | string) {
        const h = Number(value)
        if (Number.isNaN(h)) {
            console.warn(
                `${okHslColour.name}: Cannot set hue to invalid value "${value}" (${h}), ` +
                    `keeping current value "${this.#colour.h}"`,
            )
            return
        }
        this.#colour.h = ((h % okHslColour.hueMax) + okHslColour.hueMax) % okHslColour.hueMax
    }

    get hex(): string {
        return this.#colour.to(okHslColour.outputColorSpace).toString({ format: okHslColour.hexFormat })
    }

    get l(): number {
        return (this.#colour.l as number | undefined) ?? lightnessMin
    }

    set l(value: number | string) {
        const l = Number(value)
        if (Number.isNaN(l)) {
            console.warn(
                `${okHslColour.name}: Cannot set lightness to invalid value "${value}" (${l}), ` +
                    `keeping current value "${this.#colour.l}"`,
            )
            return
        }
        this.#colour.l = clamp(l, lightnessMin, lightnessMax)
    }

    get s(): number {
        return (this.#colour.s as number | undefined) ?? okHslColour.saturationMin
    }

    set s(value: number | string) {
        const s = Number(value)
        if (Number.isNaN(s)) {
            console.warn(
                `${okHslColour.name}: Cannot set saturation to invalid value "${value}" (${s}), ` +
                    `keeping current value "${this.#colour.s}"`,
            )
            return
        }
        this.#colour.s = clamp(s, okHslColour.saturationMin, okHslColour.saturationMax)
    }

    readonly #colour: Color

    constructor(argument: Color | Coords | string) {
        this.#colour =
            typeof argument === "string" || argument instanceof Color
                ? new Color(argument).to(okHslColour.colorSpace)
                : new Color({ coords: argument, space: okHslColour.colorSpace })
    }

    static mix(color1: okHslColour, color2: okHslColour, weight: number): okHslColour {
        const mix = Color.mix(color1.colourObject, color2.colourObject, weight, {
            outputSpace: this.colorSpace,
            space: this.colorSpace,
        })
        return new okHslColour(mix)
    }

    clone(): okHslColour {
        return new okHslColour(this.#colour)
    }

    toString(): string {
        return this.hex
    }
}
