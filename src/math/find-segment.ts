/**
 * Represents a point on a cubic Hermite spline curve.
 */
export interface CurvePoint {
    /** Incoming tangent (derivative at this point from the left) */
    tangentIn: number
    /** Outgoing tangent (derivative at this point to the right) */
    tangentOut: number
    /** Time coordinate (x-axis) */
    time: number
    /** Value coordinate (y-axis) */
    value: number
}

/**
 * Finds the curve segment containing the given time value.
 *
 * @param time - The time value to search for.
 * @param points - Array of curve points (must be sorted by time in ascending order).
 * @returns A tuple of [startPoint, endPoint] if found, undefined if time is out of bounds.
 */
const findSegment = (time: number, points: CurvePoint[]): [CurvePoint, CurvePoint] | undefined => {
    // Early exit for edge cases
    if (points.length < 2) {
        return undefined
    }

    // Binary search would be more efficient for large arrays, but linear search
    // is simpler and fine for small-to-medium sized curves
    for (let index = 0; index < points.length - 1; index++) {
        const p0 = points[index]
        const p1 = points[index + 1]

        if (p0 && p1 && time >= p0.time && time <= p1.time) {
            return [p0, p1]
        }
    }

    return undefined
}

/**
 * Performs cubic Hermite spline interpolation between two curve points.
 *
 * Uses the Hermite basis functions:
 * - h00(t) = 2t³ - 3t² + 1
 * - h10(t) = t³ - 2t² + t
 * - h01(t) = -2t³ + 3t²
 * - h11(t) = t³ - t²
 *
 * @param p0 - Starting point of the segment.
 * @param p1 - Ending point of the segment.
 * @param t - Normalized parameter in range [0, 1].
 * @returns The interpolated value.
 */
const hermiteInterpolation = (p0: CurvePoint, p1: CurvePoint, t: number): number => {
    const t2 = t * t
    const t3 = t2 * t

    // Hermite basis functions
    const h00 = 2 * t3 - 3 * t2 + 1 // Start value weight
    const h10 = t3 - 2 * t2 + t // Start tangent weight
    const h01 = -2 * t3 + 3 * t2 // End value weight
    const h11 = t3 - t2 // End tangent weight

    return h00 * p0.value + h10 * p0.tangentOut + h01 * p1.value + h11 * p1.tangentIn
}

/**
 * Evaluates a cubic Hermite spline curve at a given time.
 *
 * @param time - The time value to evaluate at.
 * @param points - Array of curve points sorted by time in ascending order.
 * @returns The interpolated curve value, or undefined if time is out of bounds.
 * @throws {Error} If points array is empty or not sorted.
 *
 * @example
 * const points: CurvePoint[] = [
 *   { time: 0, value: 0, tangentIn: 0, tangentOut: 1 },
 *   { time: 1, value: 1, tangentIn: 1, tangentOut: 0 }
 * ]
 * getCurveValue(0.5, points) // Returns interpolated value at t=0.5
 */
export const getCurveValue = (time: number, points: CurvePoint[]): number | undefined => {
    // Validation
    if (points.length === 0) {
        throw new Error("Points array cannot be empty")
    }

    const firstPoint = points[0]
    if (!firstPoint) {
        throw new Error("Points array cannot be empty")
    }

    if (points.length === 1) {
        // Single point - return its value if time matches
        return time === firstPoint.time ? firstPoint.value : undefined
    }

    // Find the segment containing this time
    const segment = findSegment(time, points)

    if (!segment) {
        return undefined
    }

    const [p0, p1] = segment

    // Handle edge case where p0.time === p1.time (degenerate segment)
    if (p0.time === p1.time) {
        return p0.value
    }

    // Normalise time to [0, 1] within the segment
    const t = (time - p0.time) / (p1.time - p0.time)

    return hermiteInterpolation(p0, p1, t)
}

/**
 * Evaluates a cubic Hermite spline curve at a given time with clamping.
 * If time is before the first point, returns the first value.
 * If time is after the last point, returns the last value.
 *
 * @param time - The time value to evaluate at.
 * @param points - Array of curve points sorted by time in ascending order.
 * @returns The interpolated or clamped curve value.
 *
 * @example
 * const points: CurvePoint[] = [
 *   { time: 0, value: 0, tangentIn: 0, tangentOut: 1 },
 *   { time: 1, value: 1, tangentIn: 1, tangentOut: 0 }
 * ]
 * getCurveValueClamped(-0.5, points) // Returns 0 (clamped to first point)
 * getCurveValueClamped(1.5, points)  // Returns 1 (clamped to last point)
 */
export const getCurveValueClamped = (time: number, points: CurvePoint[]): number => {
    if (points.length === 0) {
        throw new Error("Points array cannot be empty")
    }

    const firstPoint = points[0]
    if (!firstPoint) {
        throw new Error("Points array cannot be empty")
    }

    if (points.length === 1) {
        return firstPoint.value
    }

    // Clamp to first point
    if (time <= firstPoint.time) {
        return firstPoint.value
    }

    // Clamp to last point
    const lastPoint = points.at(-1)
    if (!lastPoint) {
        throw new Error("Points array cannot be empty")
    }

    if (time >= lastPoint.time) {
        return lastPoint.value
    }

    // Normal interpolation
    return getCurveValue(time, points) ?? lastPoint.value
}
