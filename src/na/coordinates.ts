import { degreesFullCircle, degreesHalfCircle, degreesQuarterCircle, speedFactor, timeFactor } from "./constants.js"

// ============================================================================
// Coordinate Transform Matrices
// ============================================================================

/**
 * Transform matrix for converting F11 coordinates to SVG coordinates.
 * This is a 2D affine transformation matrix.
 */
const transformMatrix = {
    A: -0.004_998_667_793_638_28,
    B: -0.000_000_214_642_549_806_45,
    C: 4096.886_351_518_97,
    D: 4096.902_827_874_69,
} as const

/**
 * Inverse transform matrix for converting SVG coordinates to F11 coordinates.
 */
const transformMatrixInv = {
    A: -200.053_302_087_577,
    B: -0.008_590_278_976_360_11,
    C: 819_630.836_437_126,
    D: -819_563.745_651_571,
} as const

// ============================================================================
// Coordinate Conversion Functions
// ============================================================================

/**
 * Converts F11 game coordinates to SVG coordinates (X component).
 *
 * @param x - F11 X coordinate.
 * @param y - F11 Y coordinate.
 * @returns SVG X coordinate.
 */
export const convertCoordX = (x: number, y: number): number =>
    transformMatrix.A * x + transformMatrix.B * y + transformMatrix.C

/**
 * Converts F11 game coordinates to SVG coordinates (Y component).
 *
 * @param x - F11 X coordinate.
 * @param y - F11 Y coordinate.
 * @returns SVG Y coordinate.
 */
export const convertCoordY = (x: number, y: number): number =>
    transformMatrix.B * x - transformMatrix.A * y + transformMatrix.D

/**
 * Converts SVG coordinates to F11 game coordinates (X component).
 *
 * @param x - SVG X coordinate.
 * @param y - SVG Y coordinate.
 * @returns F11 X coordinate.
 */
export const convertInvCoordX = (x: number, y: number): number =>
    transformMatrixInv.A * x + transformMatrixInv.B * y + transformMatrixInv.C

/**
 * Converts SVG coordinates to F11 game coordinates (Y component).
 *
 * @param x - SVG X coordinate.
 * @param y - SVG Y coordinate.
 * @returns F11 Y coordinate.
 */
export const convertInvCoordY = (x: number, y: number): number =>
    transformMatrixInv.B * x - transformMatrixInv.A * y + transformMatrixInv.D

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Represents a 2D coordinate as an object with x and y properties.
 */
export interface Coordinate {
    x: number
    y: number
}

/**
 * Represents a distance between two ports.
 */
export interface Distance extends Array<number> {
    0: number // From port id
    1: number // To port id
    2: number // Distance (in pixels)
}

/**
 * Represents a bounding box as two points [min, max].
 */
export type Extent = [Point, Point]

/**
 * Represents a 2D point as a tuple [x, y].
 */
export interface Point extends Array<number> {
    0: number // X coordinate
    1: number // Y coordinate
}

// ============================================================================
// Angle Conversion Functions
// ============================================================================

/**
 * Converts radians to degrees.
 *
 * @param radians - Angle in radians.
 * @returns Angle in degrees.
 *
 * @example
 * radiansToDegrees(Math.PI) // 180
 * radiansToDegrees(Math.PI / 2) // 90
 */
export const radiansToDegrees = (radians: number): number => (radians * degreesHalfCircle) / Math.PI

/**
 * Converts degrees to radians, adjusted by -90° for compass orientation.
 *
 * @param degrees - Angle in degrees.
 * @returns Angle in radians.
 *
 * @example
 * degreesToRadians(90) // 0 (90° - 90° = 0°)
 * degreesToRadians(180) // π/2 (180° - 90° = 90°)
 */
export const degreesToRadians = (degrees: number): number =>
    (Math.PI / degreesHalfCircle) * (degrees - degreesQuarterCircle)

// ============================================================================
// Angle Calculation Functions
// ============================================================================

/**
 * Calculates the angle in degrees between two points.
 * The angle is measured clockwise from north (up).
 *
 * @param centerPt - Center point (origin).
 * @param targetPt - Target point.
 * @returns Angle in degrees [0, 360).
 *
 * @example
 * rotationAngleInDegrees([0, 0], [0, -1]) // 0° (pointing up/north)
 * rotationAngleInDegrees([0, 0], [1, 0])  // 90° (pointing right/east)
 */
export const rotationAngleInDegrees = (centerPt: Point, targetPt: Point): number => {
    // Calculate angle from horizontal axis
    let theta = Math.atan2(targetPt[1] - centerPt[1], targetPt[0] - centerPt[0])

    // Adjust to measure from vertical axis (north)
    theta -= Math.PI / 2

    // Convert to degrees
    const degrees = radiansToDegrees(theta)

    // Normalize to [0, 360)
    return (degrees + degreesFullCircle) % degreesFullCircle
}

/**
 * Calculates the angle in radians between two points.
 *
 * @param centerPt - Center point (origin).
 * @param targetPt - Target point.
 * @returns Angle in radians.
 */
export const rotationAngleInRadians = (centerPt: Point, targetPt: Point): number =>
    Math.atan2(centerPt[1], centerPt[0]) - Math.atan2(targetPt[1], targetPt[0])

/**
 * Calculates the angle in radians from center point to target point.
 *
 * @param centerPt - Center point (origin).
 * @param targetPt - Target point.
 * @returns Angle in radians from horizontal axis.
 */
export const getRadians = (centerPt: Point, targetPt: Point): number =>
    Math.atan2(targetPt[1] - centerPt[1], targetPt[0] - centerPt[0])

/**
 * Calculates the angle in degrees from the origin to a point.
 * Result is normalized to [0, 360).
 *
 * @param x - X coordinate.
 * @param y - Y coordinate.
 * @returns Angle in degrees [0, 360).
 *
 * @example
 * getAngle(0, 1)   // 90°
 * getAngle(1, 0)   // 0°
 * getAngle(0, -1)  // 270°
 */
export const getAngle = (x: number, y: number): number => {
    let theta = Math.atan2(y, x)
    theta = Math.round((degreesHalfCircle / Math.PI) * theta)

    // Normalize to [0, 360)
    if (theta < 0) {
        theta = degreesFullCircle + theta
    }

    return theta
}

/**
 * Adds two angles and normalizes the result to [0, 360).
 *
 * @param a - First angle in degrees.
 * @param b - Second angle in degrees.
 * @returns Sum of angles normalized to [0, 360).
 *
 * @example
 * addAngle(350, 20)  // 10° (wraps around)
 * addAngle(90, 45)   // 135°
 * addAngle(-45, 90)  // 45°
 */
export const addAngle = (a: number, b: number): number => {
    let theta = a + b

    // Normalize to [0, 360)
    theta = ((theta % degreesFullCircle) + degreesFullCircle) % degreesFullCircle

    return theta
}

// ============================================================================
// Distance Functions
// ============================================================================

/**
 * Calculates the Euclidean distance between two points.
 *
 * @param centerPt - First point.
 * @param targetPt - Second point.
 * @returns Distance between the two points.
 *
 * @example
 * distancePoints({ x: 0, y: 0 }, { x: 3, y: 4 }) // 5
 */
export const distancePoints = (centerPt: Coordinate, targetPt: Coordinate): number =>
    Math.hypot(centerPt.x - targetPt.x, centerPt.y - targetPt.y)

/**
 * Calculates the game distance in kilometers between two SVG coordinates.
 * Converts SVG coordinates to F11 game coordinates and calculates the distance.
 *
 * @param pt0 - First point in SVG coordinates.
 * @param pt1 - Second point in SVG coordinates.
 * @returns Distance in game units (kilometers).
 *
 * @example
 * const portA = { x: 100, y: 200 }
 * const portB = { x: 300, y: 400 }
 * const distance = getDistance(portA, portB)
 */
export const getDistance = (pt0: Coordinate, pt1: Coordinate): number => {
    // Convert SVG coordinates to F11 game coordinates
    const fromF11 = {
        x: convertInvCoordX(pt0.x, pt0.y),
        y: convertInvCoordY(pt0.x, pt0.y),
    }
    const toF11 = {
        x: convertInvCoordX(pt1.x, pt1.y),
        y: convertInvCoordY(pt1.x, pt1.y),
    }

    // Calculate distance and convert to game units
    return distancePoints(fromF11, toF11) / (timeFactor * speedFactor)
}
