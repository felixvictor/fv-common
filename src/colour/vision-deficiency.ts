import Color from "colorjs.io"

export type VisionDeficiency = "deuteranopia" | "protanopia" | "tritanopia"

/** Simulated vision deficiencies, ordered from most to least common. */
export const visionDeficiencies: readonly VisionDeficiency[] = ["deuteranopia", "protanopia", "tritanopia"]

type Matrix = Parameters<typeof Color.util.multiply_v3_m3x3>[1]
type Vector = Parameters<typeof Color.util.multiply_v3_m3x3>[0]

/**
 * Machado, Oliveira & Fernandes (2009), "A Physiologically-based Model for Simulation of Color Vision Deficiency",
 * severity 1.0 (complete dichromacy). The matrices apply to linear sRGB; colorjs.io has no simulation of its own.
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
const linearSrgbSpace = "srgb-linear"
const srgbSpace = "srgb"
const clipMethod = "clip"
const hexFormat = "hex"

/**
 * Simulates how a colour appears with the given vision deficiency.
 *
 * Achromatic colours stay unchanged (each matrix row sums to 1). Out-of-gamut results are clipped per channel.
 *
 * @returns The simulated colour as hex string.
 */
export const simulateVisionDeficiency = (hex: string, deficiency: VisionDeficiency): string => {
    const [red, green, blue] = new Color(hex).to(linearSrgbSpace).coords
    const linear: Vector = [red ?? channelMin, green ?? channelMin, blue ?? channelMin]
    const simulated = Color.util.multiply_v3_m3x3(linear, machadoMatrices[deficiency])

    return new Color({ coords: simulated, space: linearSrgbSpace })
        .toGamut({ method: clipMethod, space: srgbSpace })
        .to(srgbSpace)
        .toString({ format: hexFormat })
}
