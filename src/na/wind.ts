import { degreesFullCircle } from "./constants.js"

/**
 * Number of segments to divide the wind rose/compass into.
 */
export const numberSegments = 24

/**
 * Radians per segment of the wind rose.
 * Calculated as (2π / numberSegments).
 */
export const segmentRadians = (2 * Math.PI) / numberSegments

/**
 * Factor used for scaling the wind rose circle radius.
 */
export const circleRadiusFactor = 5

/**
 * Duration in seconds for a complete wind cycle (360° rotation).
 * Represents 48 minutes and 55 seconds.
 */
const secondsForFullCircle = 2935 // 48 * 60 + 55

/**
 * Degrees the wind rotates per second.
 * Calculated as 360° / secondsForFullCircle.
 */
export const degreesPerSecond = degreesFullCircle / secondsForFullCircle

/**
 * Subtracts a value from a wind direction and normalizes to 0-360° range.
 *
 * @param wind - Current wind direction in degrees (0-360).
 * @param sub - Value to subtract (will be normalized with modulo 360).
 * @returns Normalized wind direction in the range [0, 360).
 *
 * @example
 * subtractFromWind(90, 45)   // 45
 * subtractFromWind(30, 90)   // 300 (wraps around)
 * subtractFromWind(180, 540) // 0 (540 % 360 = 180, 180 - 180 = 0)
 */
export const subtractFromWind = (wind: number, sub: number): number => {
    // Normalize the subtraction value to 0-360 range
    const normalizedSub = sub % 360

    // Perform subtraction
    let result = Math.round(wind - normalizedSub)

    // Normalize result to [0, 360) range
    while (result >= 360) {
        result -= 360
    }
    while (result < 0) {
        result += 360
    }

    return result
}

/**
 * Alternative implementation using modulo for normalization.
 * Mathematically equivalent but more concise.
 *
 * @param wind - Current wind direction in degrees (0-360).
 * @param sub - Value to subtract.
 * @returns Normalized wind direction in the range [0, 360).
 */
export const subtractFromWindAlt = (wind: number, sub: number): number => {
    const result = Math.round(wind - (sub % 360))
    return ((result % 360) + 360) % 360
}
