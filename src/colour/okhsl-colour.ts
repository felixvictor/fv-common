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
        this.#safeSet("hue", "h", value, (v) => ((v % okHslColour.hueMax) + okHslColour.hueMax) % okHslColour.hueMax)
    }

    get hex(): string {
        return this.#colour.to(okHslColour.outputColorSpace).toString({ format: okHslColour.hexFormat })
    }

    get l(): number {
        return (this.#colour.l as number | undefined) ?? lightnessMin
    }

    set l(value: number | string) {
        this.#safeSet("lightness", "l", value, (v) => clamp(v, lightnessMin, lightnessMax))
    }

    get s(): number {
        return (this.#colour.s as number | undefined) ?? okHslColour.saturationMin
    }

    set s(value: number | string) {
        this.#safeSet("saturation", "s", value, (v) => clamp(v, okHslColour.saturationMin, okHslColour.saturationMax))
    }

    readonly #colour: Color

    constructor(argument: Color | Coords | string) {
        this.#colour =
            typeof argument === "string" || argument instanceof Color
                ? new Color(argument).to(okHslColour.colorSpace)
                : new Color({ coords: argument, space: okHslColour.colorSpace })
    }

    static mix(color1: okHslColour, color2: okHslColour, weight: number): okHslColour {
        return new okHslColour(
            Color.mix(color1.colourObject, color2.colourObject, weight, {
                outputSpace: this.colorSpace,
                space: this.colorSpace,
            }),
        )
    }

    clone(): okHslColour {
        return new okHslColour(this.#colour)
    }

    toString(): string {
        return this.hex
    }

    #safeSet(label: string, property: "h" | "l" | "s", value: number | string, transform: (v: number) => number): void {
        const parsed = Number(value)

        if (Number.isNaN(parsed)) {
            console.warn(
                `${okHslColour.name}: Cannot set ${label} to invalid value "${value}" (${parsed}), ` +
                    `keeping current value "${this.#colour[property]}"`,
            )
            return
        }

        this.#colour[property] = transform(parsed)
    }
}
