import {
    getRelativeLuminance,
    hexToOklch,
    type LinearRgb,
    linearRgbToHex,
    mapOklchToSrgb,
    normaliseHue,
} from "@/colour/oklch"
import { type PaletteRange, paletteRangeTones } from "@/colour/palette-range"
import { toneMax, toneMin, toneToLuminance } from "@/colour/tone"
import { clampUnsafe } from "@/common"

export interface TonalPaletteOptions {
    /**
     * Share of the chroma kept at tone 0 and 100. Chroma follows `floor + (1 − floor) · sin(π · tone / 100)`: full
     * chroma at tone 50, easing towards both ends (the sine easing of Oklchroma). 1 keeps the chroma constant, as in
     * MD3.
     */
    readonly chromaFloor?: number
    /**
     * Hue rotation in degrees at tone 100 relative to tone 50, mirrored towards tone 0. Compensates the Bezold–Brücke
     * shift; OKLCH already keeps hue fairly constant over lightness, so the default is 0.
     */
    readonly hueShift?: number
}

/** Constant chroma over all tones. */
export const constantChromaFloor = 1
const defaultHueShift = 0

const midTone = (toneMin + toneMax) / 2
const unitMin = 0
const unitMax = 1
const blackRgb: LinearRgb = [unitMin, unitMin, unitMin]
const whiteRgb: LinearRgb = [unitMax, unitMax, unitMax]
/** Halving steps of the lightness search; 2^-32 is far below the 8-bit resolution of hex output. */
const lightnessSearchIterations = 32

/**
 * Tonal palette of one hue: any tone (CIE L*, 0–100) maps to an sRGB colour of that hue.
 *
 * Hue and chroma are set in OKLCH. For a tone, the OKLCH lightness is searched so that the colour, after mapping into
 * sRGB by reducing chroma, has exactly the luminance of the tone. Hence tones are absolute, shared by light and dark
 * themes, and the contrast between two tones does not depend on the hue.
 */
export class TonalPalette {
    get chroma(): number {
        return this.#chroma
    }

    get hue(): number {
        return this.#hue
    }

    readonly #cache = new Map<number, string>()
    readonly #chroma: number
    readonly #chromaFloor: number
    readonly #hue: number
    readonly #hueShift: number

    constructor(
        hue: number,
        chroma: number,
        { chromaFloor = constantChromaFloor, hueShift = defaultHueShift }: TonalPaletteOptions = {},
    ) {
        this.#hue = normaliseHue(hue)
        this.#chroma = Math.max(0, chroma)
        this.#chromaFloor = clampUnsafe(chromaFloor, unitMin, unitMax)
        this.#hueShift = hueShift
    }

    /** Palette with hue and chroma of the seed; the seed's lightness is irrelevant. */
    static fromHex(hex: string, options: TonalPaletteOptions = {}): TonalPalette {
        const { chroma, hue } = hexToOklch(hex)
        return new TonalPalette(hue, chroma, options)
    }

    /** Colour at the tone (CIE L*); tones outside 0–100 are clamped. */
    tone(tone: number): string {
        const clampedTone = clampUnsafe(tone, toneMin, toneMax)
        let hex = this.#cache.get(clampedTone)
        if (hex === undefined) {
            hex = this.#computeTone(clampedTone)
            this.#cache.set(clampedTone, hex)
        }
        return hex
    }

    /** Colours at the given tones, by default the tones of an exported palette range ({@link paletteRangeTones}). */
    toneRange(tones: readonly number[] = paletteRangeTones): PaletteRange {
        return tones.map((tone) => this.tone(tone))
    }

    #chromaAt(tone: number): number {
        const envelope = Math.sin((Math.PI * tone) / toneMax)
        return this.#chroma * (this.#chromaFloor + (1 - this.#chromaFloor) * envelope)
    }

    #computeTone(tone: number): string {
        if (tone <= toneMin) return linearRgbToHex(blackRgb)
        if (tone >= toneMax) return linearRgbToHex(whiteRgb)

        const targetLuminance = toneToLuminance(tone)
        const chroma = this.#chromaAt(tone)
        const hue = this.#hueAt(tone)

        let lower = unitMin
        let upper = unitMax
        let rgb = blackRgb
        for (let iteration = 0; iteration < lightnessSearchIterations; iteration++) {
            const lightness = (lower + upper) / 2
            rgb = mapOklchToSrgb({ chroma, hue, lightness })
            if (getRelativeLuminance(rgb) < targetLuminance) {
                lower = lightness
            } else {
                upper = lightness
            }
        }

        return linearRgbToHex(rgb)
    }

    #hueAt(tone: number): number {
        return normaliseHue(this.#hue + (this.#hueShift * (tone - midTone)) / midTone)
    }
}
