import { compassDirections, degreesFullCircle, degreesHalfCircle, degreesPerDirection } from "./constants.js"

// ============================================================================
// Conversion Functions
// ============================================================================

/**
 * Converts a compass direction to degrees.
 *
 * @param compass - Compass direction (e.g., "N", "NE", "E⅓SE").
 * @returns Degrees (0-345 in 15° increments).
 *
 * @example
 * compassToDegrees("N")    // 0
 * compassToDegrees("NE")   // 45
 * compassToDegrees("E")    // 90
 * compassToDegrees("S")    // 180
 */
export const compassToDegrees = (compass: string): number => {
    const index = compassDirections.indexOf(compass as (typeof compassDirections)[number])
    return index * degreesPerDirection
}

/**
 * Converts degrees to the nearest compass direction.
 *
 * @param degrees - Angle in degrees (0-360).
 * @returns Compass direction, or "n/a" if degrees is undefined.
 *
 * @example
 * degreesToCompass(0)    // "N"
 * degreesToCompass(45)   // "NE"
 * degreesToCompass(135)  // "SE"
 * degreesToCompass(355)  // "N" (wraps around)
 */
export const degreesToCompass = (degrees: number | undefined): string => {
    if (degrees === undefined) {
        return "n/a"
    }

    // Round to nearest direction (add 0.5 tick for rounding)
    const index = Math.floor(degrees / degreesPerDirection + 0.5)

    // Handle wrap-around using modulo
    return compassDirections[index % compassDirections.length] ?? ""
}

/**
 * Converts a slider value (adjusted by 180°) to compass direction.
 * Used when sliders have their zero point shifted.
 *
 * @param degrees - Slider value in degrees.
 * @returns Compass direction.
 *
 * @example
 * degreesToCompassSlider(180) // "N" (180° + 180° = 360° = 0°)
 */
export const degreesToCompassSlider = (degrees: number | undefined): string =>
    degreesToCompass(compassDirectionFromSlider(degrees))

/**
 * Adjusts compass direction from slider by adding 180°.
 * This shifts the slider's reference point by half a circle.
 *
 * @param compassDirection - Direction value from slider.
 * @returns Adjusted direction in degrees.
 *
 * @example
 * compassDirectionFromSlider(0)   // 180
 * compassDirectionFromSlider(180) // 0 (wraps around)
 */
export const compassDirectionFromSlider = (compassDirection: number | undefined): number =>
    (Number(compassDirection) + degreesHalfCircle) % degreesFullCircle

/**
 * Formats a wind direction as both compass direction and degrees.
 *
 * @param wind - Wind direction as compass string or degrees number.
 * @param svg - If true, uses 'tspan' tags instead of 'span' (for SVG context).
 * @returns HTML string with formatted compass and degrees.
 *
 * @example
 * displayCompassAndDegrees(45)     // "<span class="caps">NE</span> (45°)"
 * displayCompassAndDegrees("NE")   // "<span class="caps">NE</span> (45°)"
 * displayCompassAndDegrees(90, true) // "<tspan class="caps">E</tspan> (90°)"
 */
export const displayCompassAndDegrees = (wind: number | string, svg = false): string => {
    let compass: string
    let degrees: number

    // Determine if input is compass string or degrees
    if (Number.isNaN(Number(wind))) {
        compass = wind as string
        degrees = compassToDegrees(compass) % degreesFullCircle
    } else {
        degrees = Number(wind)
        compass = degreesToCompass(degrees)
    }

    const tag = svg ? "tspan" : "span"
    return `<${tag} class="caps">${compass}</${tag}> (${degrees}°)`
}

// ============================================================================
// Direction Type Checking
// ============================================================================

/**
 * Checks if a compass index represents a cardinal or intercardinal direction.
 * Cardinal: N, E, S, W (every 6th position)
 * Intercardinal: NE, SE, SW, NW (every 6th position, offset by 3)
 *
 * @param index - Index in compassDirections array (0-23).
 * @returns True if cardinal or intercardinal direction.
 *
 * @example
 * isCardinalOrIntercardinal(0)  // true  (N)
 * isCardinalOrIntercardinal(3)  // true  (NE)
 * isCardinalOrIntercardinal(6)  // true  (E)
 * isCardinalOrIntercardinal(1)  // false (N⅓NE)
 */
export const isCardinalOrIntercardinal = (index: number): boolean => index % 3 === 0

/**
 * Checks if a compass index represents a cardinal direction (N, E, S, W).
 *
 * @param index - Index in compassDirections array (0-23).
 * @returns True if cardinal direction.
 *
 * @example
 * isCardinal(0)  // true  (N)
 * isCardinal(6)  // true  (E)
 * isCardinal(12) // true  (S)
 * isCardinal(3)  // false (NE - intercardinal)
 */
export const isCardinal = (index: number): boolean => index % 6 === 0
