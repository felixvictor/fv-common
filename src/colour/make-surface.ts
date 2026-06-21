import { okHslColour } from "@/colour/okhsl-colour"

export class MakeSurface {
    readonly #baseOkhsl: okHslColour

    readonly #darkSurfaceChromaBright = 0.16
    readonly #darkSurfaceChromaLight = 0.14
    readonly #darkSurfaceChromaMain = 0.12
    readonly #darkSurfaceChromaVariant = 0.22
    readonly #darkSurfaceLightnessBright = 0.13
    readonly #darkSurfaceLightnessLight = 0.09
    readonly #darkSurfaceLightnessMain = 0.06
    readonly #darkSurfaceLightnessVariant = 0.16

    readonly #lightSurfaceChromaBright = 0.25
    readonly #lightSurfaceChromaLight = 0.5
    readonly #lightSurfaceChromaMain = 0.42
    readonly #lightSurfaceChromaVariant = 0.65
    readonly #lightSurfaceLightnessBright = 0.985
    readonly #lightSurfaceLightnessLight = 0.92
    readonly #lightSurfaceLightnessMain = 0.95
    readonly #lightSurfaceLightnessVariant = 0.915

    constructor(baseHex: string) {
        this.#baseOkhsl = new okHslColour(baseHex)
    }

    getSurface = (lightness: number, chromaFraction: number): string => {
        const h = this.#baseOkhsl.h
        const s = this.#baseOkhsl.s
        return new okHslColour([h, s * chromaFraction, lightness]).hex
    }

    makeSurface() {
        return {
            darkSurfaceBrightHex: this.getSurface(this.#darkSurfaceLightnessBright, this.#darkSurfaceChromaBright),
            darkSurfaceLightHex: this.getSurface(this.#darkSurfaceLightnessLight, this.#darkSurfaceChromaLight),
            darkSurfaceMainHex: this.getSurface(this.#darkSurfaceLightnessMain, this.#darkSurfaceChromaMain),
            darkSurfaceVariantHex: this.getSurface(this.#darkSurfaceLightnessVariant, this.#darkSurfaceChromaVariant),

            lightSurfaceBrightHex: this.getSurface(this.#lightSurfaceLightnessBright, this.#lightSurfaceChromaBright),
            lightSurfaceLightHex: this.getSurface(this.#lightSurfaceLightnessLight, this.#lightSurfaceChromaLight),
            lightSurfaceMainHex: this.getSurface(this.#lightSurfaceLightnessMain, this.#lightSurfaceChromaMain),
            lightSurfaceVariantHex: this.getSurface(
                this.#lightSurfaceLightnessVariant,
                this.#lightSurfaceChromaVariant,
            ),
        } as const
    }
}
