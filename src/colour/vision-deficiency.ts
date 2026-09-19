import { clamp } from "@/common"
import Color, { type Coords } from "colorjs.io"

export type VisionDeficiency = "deuteranopia" | "protanopia" | "tritanopia"

/** Simulated vision deficiencies, ordered from most to least common. */
export const visionDeficiencies: readonly VisionDeficiency[] = ["deuteranopia", "protanopia", "tritanopia"]

type Matrix = readonly [
    readonly [number, number, number],
    readonly [number, number, number],
    readonly [number, number, number],
]

/**
 * Machado, Oliveira & Fernandes (2009), "A Physiologically-based Model for Simulation of Color Vision Deficiency",
 * severity 1.0 (complete dichromacy). The matrices apply to linear sRGB.
 */
const machadoMatrices: Record<VisionDeficiency, Matrix> = {
    deuteranopia: [
        [0.367_322, 0.860_646, -0.227_968],
        [0.280_085, 0.672_501, 0.047_413],
        [-0.011_82, 0.042_94, 0.968_881],
    ],
    protanopia: [
        [0.152_286, 1.052_583, -0.204_868],
        [0.114_503, 0.786_281, 0.099_216],
        [-0.003_882, -0.048_116, 1.051_998],
    ],
    tritanopia: [
        [1.255_528, -0.076_749, -0.178_779],
        [-0.078_411, 0.930_809, 0.147_602],
        [0.004_733, 0.691_367, 0.303_9],
    ],
}

const channelMin = 0
const channelMax = 1
const linearSrgbSpace = "srgb-linear"
const srgbSpace = "srgb"
const hexFormat = "hex"

/**
 * Simulates how a colour appears with the given vision deficiency.
 *
 * Achromatic colours stay unchanged (each matrix row sums to 1). Out-of-gamut results are clamped per channel.
 *
 * @returns The simulated colour as hex string.
 */
export const simulateVisionDeficiency = (hex: string, deficiency: VisionDeficiency): string => {
    const [red = channelMin, green = channelMin, blue = channelMin] = new Color(hex)
        .to(linearSrgbSpace)
        .coords.map((channel) => channel ?? channelMin)
    const [[m00, m01, m02], [m10, m11, m12], [m20, m21, m22]] = machadoMatrices[deficiency]

    const coords: Coords = [
        clamp(m00 * red + m01 * green + m02 * blue, channelMin, channelMax),
        clamp(m10 * red + m11 * green + m12 * blue, channelMin, channelMax),
        clamp(m20 * red + m21 * green + m22 * blue, channelMin, channelMax),
    ]

    return new Color({ coords, space: linearSrgbSpace }).to(srgbSpace).toString({ format: hexFormat })
}
