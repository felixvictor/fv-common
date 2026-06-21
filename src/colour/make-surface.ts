import { okHslColour } from "@/colour/okhsl-colour"
import { minSurfaceLightnessDelta } from "@/colour/validation"

export class MakeSurface {
    static readonly #darkChromaMain = 0.12
    static readonly #darkChromaBright = MakeSurface.#darkChromaMain * 1.3
    static readonly #darkChromaLight = MakeSurface.#darkChromaMain * 1.1
    static readonly #darkChromaVariant = MakeSurface.#darkChromaMain * 1.8
    static readonly #darkMainL = 0.06

    static readonly #lightChromaMain = 0.42
    static readonly #lightChromaBright = MakeSurface.#lightChromaMain * 0.6
    static readonly #lightChromaLight = MakeSurface.#lightChromaMain * 1.2
    static readonly #lightChromaVariant = MakeSurface.#lightChromaMain * 1.5
    static readonly #lightMainL = 0.95

    static readonly #paddingL = 0.005
    static readonly #stepL = minSurfaceLightnessDelta + MakeSurface.#paddingL

    readonly #baseOkhsl: okHslColour

    constructor(baseHex: string) {
        this.#baseOkhsl = new okHslColour(baseHex)
    }

    calculateSurface(lightness: number, chromaFactor: number): string {
        const h = this.#baseOkhsl.h
        const s = this.#baseOkhsl.s * chromaFactor
        return new okHslColour([h, s, lightness]).hex
    }

    makeSurface() {
        const lightMain = MakeSurface.#lightMainL
        const lightBright = lightMain + MakeSurface.#stepL
        const lightLight = lightMain - MakeSurface.#stepL
        const lightVariant = lightLight - MakeSurface.#stepL

        const darkMain = MakeSurface.#darkMainL
        const darkLight = darkMain + MakeSurface.#stepL
        const darkBright = darkLight + MakeSurface.#stepL
        const darkVariant = darkBright + MakeSurface.#stepL

        return {
            darkSurfaceBrightHex: this.calculateSurface(darkBright, MakeSurface.#darkChromaBright),
            darkSurfaceLightHex: this.calculateSurface(darkLight, MakeSurface.#darkChromaLight),
            darkSurfaceMainHex: this.calculateSurface(darkMain, MakeSurface.#darkChromaMain),
            darkSurfaceVariantHex: this.calculateSurface(darkVariant, MakeSurface.#darkChromaVariant),

            lightSurfaceBrightHex: this.calculateSurface(lightBright, MakeSurface.#lightChromaBright),
            lightSurfaceLightHex: this.calculateSurface(lightLight, MakeSurface.#lightChromaLight),
            lightSurfaceMainHex: this.calculateSurface(lightMain, MakeSurface.#lightChromaMain),
            lightSurfaceVariantHex: this.calculateSurface(lightVariant, MakeSurface.#lightChromaVariant),
        } as const
    }
}
