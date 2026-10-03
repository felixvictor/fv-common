import { clampUnsafe } from "@/common"
import Color from "colorjs.io"

/** Linear-light sRGB channels; values outside 0–1 lie outside the sRGB gamut. */
export type LinearRgb = readonly [red: number, green: number, blue: number]

/**
 * Polar OKLab coordinates.
 *
 * Chroma is absolute: equal chroma means similar colourfulness across hues, so chroma is comparable and blendable
 * between colours.
 */
export interface Oklch {
    /** 0 for grey; about 0.37 at most within sRGB. */
    readonly chroma: number
    /** Degrees, 0–360. */
    readonly hue: number
    /** 0 (black) to 1 (white). */
    readonly lightness: number
}

type Matrix3 = readonly [Vector3, Vector3, Vector3]
type Vector3 = readonly [number, number, number]

// Björn Ottosson, "A perceptual color space for image processing" (2020), https://bottosson.github.io/posts/oklab/
const linearRgbToLms: Matrix3 = [
    [0.412_221_470_8, 0.536_332_536_3, 0.051_445_992_9],
    [0.211_903_498_2, 0.680_699_545_1, 0.107_396_956_6],
    [0.088_302_461_9, 0.281_718_837_6, 0.629_978_700_5],
]
const lmsRootToOklab: Matrix3 = [
    [0.210_454_255_3, 0.793_617_785, -0.004_072_046_8],
    [1.977_998_495_1, -2.428_592_205, 0.450_593_709_9],
    [0.025_904_037_1, 0.782_771_766_2, -0.808_675_766],
]
const oklabToLmsRoot: Matrix3 = [
    [1, 0.396_337_777_4, 0.215_803_757_3],
    [1, -0.105_561_345_8, -0.063_854_172_8],
    [1, -0.089_484_177_5, -1.291_485_548],
]
const lmsToLinearRgb: Matrix3 = [
    [4.076_741_662_1, -3.307_711_591_3, 0.230_969_929_2],
    [-1.268_438_004_6, 2.609_757_401_1, -0.341_319_396_5],
    [-0.004_196_086_3, -0.703_418_614_7, 1.707_614_701],
]

/** SRGB → XYZ D65, Y row (relative luminance as used by WCAG). */
const luminanceCoefficients: Vector3 = [0.212_6, 0.715_2, 0.072_2]

// sRGB transfer function (IEC 61966-2-1)
const srgbDecodeThreshold = 0.040_45
const srgbEncodeThreshold = 0.003_130_8
const srgbLinearSlope = 12.92
const srgbGammaOffset = 0.055
const srgbGammaScale = 1.055
const srgbGamma = 2.4

const channelMin = 0
const channelMax = 1
const channelMaxByte = 255
const hexRadix = 16
const hexDigitsPerChannel = 2
/** Tolerance for rounding noise when testing gamut membership. */
const gamutEpsilon = 1e-6
/** Halving steps of the chroma search; 2^-20 of the chroma is far below the 8-bit resolution of hex output. */
const gamutSearchIterations = 20

const fullTurn = 360
const halfTurn = 180
const degreesToRadians = Math.PI / halfTurn

const multiply = ([[a, b, c], [d, e, f], [g, h, i]]: Matrix3, [x, y, z]: Vector3): Vector3 => [
    a * x + b * y + c * z,
    d * x + e * y + f * z,
    g * x + h * y + i * z,
]

const decodeChannel = (value: number): number =>
    value <= srgbDecodeThreshold ? value / srgbLinearSlope : ((value + srgbGammaOffset) / srgbGammaScale) ** srgbGamma

const encodeChannel = (value: number): number =>
    value <= srgbEncodeThreshold ? value * srgbLinearSlope : srgbGammaScale * value ** (1 / srgbGamma) - srgbGammaOffset

const channelToHex = (value: number): string =>
    Math.round(
        clampUnsafe(encodeChannel(clampUnsafe(value, channelMin, channelMax)), channelMin, channelMax) * channelMaxByte,
    )
        .toString(hexRadix)
        .padStart(hexDigitsPerChannel, "0")

/** Normalises a hue to 0 ≤ hue < 360. */
export const normaliseHue = (hue: number): number => ((hue % fullTurn) + fullTurn) % fullTurn

/** Signed shortest rotation in degrees from `fromHue` to `toHue`, in the range −180 < difference ≤ 180. */
export const getHueDifference = (fromHue: number, toHue: number): number => {
    const difference = normaliseHue(toHue - fromHue)
    return difference > halfTurn ? difference - fullTurn : difference
}

/** Parses any CSS colour string into linear-light sRGB. */
export const hexToLinearRgb = (hex: string): LinearRgb => {
    const [red = channelMin, green = channelMin, blue = channelMin] = new Color(hex)
        .to("srgb")
        .coords.map((channel) => channel ?? channelMin)
    return [decodeChannel(red), decodeChannel(green), decodeChannel(blue)]
}

/** Formats linear-light sRGB as `#rrggbb`; out-of-gamut channels are clipped. */
export const linearRgbToHex = ([red, green, blue]: LinearRgb): string =>
    `#${channelToHex(red)}${channelToHex(green)}${channelToHex(blue)}`

export const linearRgbToOklch = (rgb: LinearRgb): Oklch => {
    const [l, m, s] = multiply(linearRgbToLms, rgb)
    const [lightness, a, b] = multiply(lmsRootToOklab, [Math.cbrt(l), Math.cbrt(m), Math.cbrt(s)])
    return {
        chroma: Math.hypot(a, b),
        hue: normaliseHue(Math.atan2(b, a) / degreesToRadians),
        lightness,
    }
}

export const oklchToLinearRgb = ({ chroma, hue, lightness }: Oklch): LinearRgb => {
    const angle = hue * degreesToRadians
    const [lRoot, mRoot, sRoot] = multiply(oklabToLmsRoot, [
        lightness,
        chroma * Math.cos(angle),
        chroma * Math.sin(angle),
    ])
    return multiply(lmsToLinearRgb, [lRoot ** 3, mRoot ** 3, sRoot ** 3])
}

export const hexToOklch = (hex: string): Oklch => linearRgbToOklch(hexToLinearRgb(hex))

export const oklchToHex = (colour: Oklch): string => linearRgbToHex(oklchToLinearRgb(colour))

export const isInSrgbGamut = (rgb: LinearRgb): boolean =>
    rgb.every((channel) => channel >= channelMin - gamutEpsilon && channel <= channelMax + gamutEpsilon)

/**
 * Maps a colour into the sRGB gamut by reducing its chroma; lightness and hue stay unchanged (the CSS Color 4 approach
 * without the ΔE shortcut). Grey (chroma 0) is always in gamut for lightness 0–1.
 */
export const mapOklchToSrgb = (colour: Oklch): LinearRgb => {
    const rgb = oklchToLinearRgb(colour)
    if (isInSrgbGamut(rgb)) return rgb

    let lower = 0
    let upper = colour.chroma
    let mapped = oklchToLinearRgb({ ...colour, chroma: lower })
    for (let iteration = 0; iteration < gamutSearchIterations; iteration++) {
        const chroma = (lower + upper) / 2
        const candidate = oklchToLinearRgb({ ...colour, chroma })
        if (isInSrgbGamut(candidate)) {
            lower = chroma
            mapped = candidate
        } else {
            upper = chroma
        }
    }

    return mapped
}

/** Relative luminance (CIE Y, 0–1) of a linear-light sRGB colour; the quantity WCAG contrast is based on. */
export const getRelativeLuminance = ([red, green, blue]: LinearRgb): number => {
    const [redWeight, greenWeight, blueWeight] = luminanceCoefficients
    return redWeight * red + greenWeight * green + blueWeight * blue
}

/** Hue distance in degrees (0–180) between two colours in OKLCH. */
export const getHueDistance = (hexA: string, hexB: string): number =>
    Math.abs(getHueDifference(hexToOklch(hexA).hue, hexToOklch(hexB).hue))
