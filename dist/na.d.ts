import dayjs from "dayjs";

//#region src/na/compass.d.ts

/**
 * Compass directions using 24-point compass rose.
 * Each direction represents 15° (360° / 24).
 *
 * Format uses fractional notation:
 * - N⅓NE means "North by one-third toward Northeast" (between N and NE)
 * - N⅔NE means "North by two-thirds toward Northeast" (closer to NE)
 */
declare const compassDirections: readonly ["N", "N⅓NE", "N⅔NE", "NE", "E⅔NE", "E⅓NE", "E", "E⅓SE", "E⅔SE", "SE", "S⅔SE", "S⅓SE", "S", "S⅓SW", "S⅔SW", "SW", "W⅔SW", "W⅓SW", "W", "W⅓NW", "W⅔NW", "NW", "N⅔NW", "N⅓NW"];
/**
 * Degrees per compass direction (15° for 24-point compass).
 */
declare const degreesPerDirection: number;
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
declare const compassToDegrees: (compass: string) => number;
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
declare const degreesToCompass: (degrees: number | undefined) => string;
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
declare const degreesToCompassSlider: (degrees: number | undefined) => string;
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
declare const compassDirectionFromSlider: (compassDirection: number | undefined) => number;
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
declare const displayCompassAndDegrees: (wind: number | string, svg?: boolean) => string;
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
declare const isCardinalOrIntercardinal: (index: number) => boolean;
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
declare const isCardinal: (index: number) => boolean;
//#endregion
//#region src/na/constants.d.ts
declare const speedFactor = 390;
declare const timeFactor = 2.63;
declare const distanceMapSize = 8192;
declare const mapSize = 8192;
declare const minDeepWaterBR = 22;
declare const serverMaintenanceHour = 10;
declare const hoursPerDay = 24;
declare const maxPortBattleHour: number;
declare const degreesFullCircle = 360;
declare const degreesHalfCircle = 180;
declare const degreesQuarterCircle = 90;
//#endregion
//#region src/na/coordinates.d.ts
/**
 * Converts F11 game coordinates to SVG coordinates (X component).
 *
 * @param x - F11 X coordinate.
 * @param y - F11 Y coordinate.
 * @returns SVG X coordinate.
 */
declare const convertCoordX: (x: number, y: number) => number;
/**
 * Converts F11 game coordinates to SVG coordinates (Y component).
 *
 * @param x - F11 X coordinate.
 * @param y - F11 Y coordinate.
 * @returns SVG Y coordinate.
 */
declare const convertCoordY: (x: number, y: number) => number;
/**
 * Converts SVG coordinates to F11 game coordinates (X component).
 *
 * @param x - SVG X coordinate.
 * @param y - SVG Y coordinate.
 * @returns F11 X coordinate.
 */
declare const convertInvCoordX: (x: number, y: number) => number;
/**
 * Converts SVG coordinates to F11 game coordinates (Y component).
 *
 * @param x - SVG X coordinate.
 * @param y - SVG Y coordinate.
 * @returns F11 Y coordinate.
 */
declare const convertInvCoordY: (x: number, y: number) => number;
/**
 * Represents a 2D coordinate as an object with x and y properties.
 */
interface Coordinate {
  x: number;
  y: number;
}
/**
 * Represents a distance between two ports.
 */
interface Distance extends Array<number> {
  0: number;
  1: number;
  2: number;
}
/**
 * Represents a bounding box as two points [min, max].
 */
type Extent = [Point, Point];
/**
 * Represents a 2D point as a tuple [x, y].
 */
interface Point extends Array<number> {
  0: number;
  1: number;
}
type PointTuple = [number, number];
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
declare const radiansToDegrees: (radians: number) => number;
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
declare const degreesToRadians: (degrees: number) => number;
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
declare const rotationAngleInDegrees: (centerPt: Point, targetPt: Point) => number;
/**
 * Calculates the angle in radians between two points.
 *
 * @param centerPt - Center point (origin).
 * @param targetPt - Target point.
 * @returns Angle in radians.
 */
declare const rotationAngleInRadians: (centerPt: Point, targetPt: Point) => number;
/**
 * Calculates the angle in radians from center point to target point.
 *
 * @param centerPt - Center point (origin).
 * @param targetPt - Target point.
 * @returns Angle in radians from horizontal axis.
 */
declare const getRadians: (centerPt: Point, targetPt: Point) => number;
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
declare const getAngle: (x: number, y: number) => number;
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
declare const addAngle: (a: number, b: number) => number;
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
declare const distancePoints: (centerPt: Coordinate, targetPt: Coordinate) => number;
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
declare const getDistance: (pt0: Coordinate, pt1: Coordinate) => number;
/**
 * Adjust for openlayers (top left is not [0,0] but [0,mapSize])
 */
declare const coordinateAdjust: (x: number | PointTuple | PointTuple[], y?: number) => PointTuple | PointTuple[];
//#endregion
//#region src/na/server-time.d.ts
/**
 * Get current server start (date and time).
 * This is the most recent maintenance time that has passed.
 */
declare const getCurrentServerStart: () => dayjs.Dayjs;
/**
 * Get previous server start (date and time).
 */
declare const getPreviousServerStart: () => dayjs.Dayjs;
/**
 * Get next server start (date and time).
 */
declare const getNextServerStart: () => dayjs.Dayjs;
/**
 * Current server start datetime formatted as "YYYY-MM-DD HH:mm".
 */
declare const currentServerStartDateTime: string;
/**
 * Current server start date formatted as "YYYY-MM-DD".
 */
declare const currentServerStartDate: string;
/**
 * Previous server start date formatted as "YYYY-MM-DD".
 */
declare const previousServerStartDate: string;
/**
 * Current server date year as a string.
 */
declare const currentServerDateYear: string;
/**
 * Current server date month as a zero-padded string (01-12).
 */
declare const currentServerDateMonth: string;
//#endregion
//#region src/na/time.d.ts
/**
 * Calculates and formats the port battle time window.
 *
 * @param startHoursFromSMH - Hours offset from server maintenance hour.
 * @param isNeutralPort - Whether this is a neutral port (9h window vs 2h).
 * @returns Formatted time range string with UTC and local times.
 *
 * @example
 * getPortBattleTime(0, false) // "10 – 8 (14 – 12 local)" (if local is UTC+4)
 * getPortBattleTime(2, true)  // "12 – 21 (16 – 1 local)" (9-hour neutral port window)
 */
declare const getPortBattleTime: (startHoursFromSMH: number, isNeutralPort?: boolean) => string;
//#endregion
//#region src/na/wind.d.ts
/**
 * Number of segments to divide the wind rose/compass into.
 */
declare const numberSegments = 24;
/**
 * Radians per segment of the wind rose.
 * Calculated as (2π / numberSegments).
 */
declare const segmentRadians: number;
/**
 * Factor used for scaling the wind rose circle radius.
 */
declare const circleRadiusFactor = 5;
/**
 * Degrees the wind rotates per second.
 * Calculated as 360° / secondsForFullCircle.
 */
declare const degreesPerSecond: number;
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
declare const subtractFromWind: (wind: number, sub: number) => number;
/**
 * Alternative implementation using modulo for normalization.
 * Mathematically equivalent but more concise.
 *
 * @param wind - Current wind direction in degrees (0-360).
 * @param sub - Value to subtract.
 * @returns Normalized wind direction in the range [0, 360).
 */
declare const subtractFromWindAlt: (wind: number, sub: number) => number;
//#endregion
export { type Coordinate, type Distance, type Extent, type Point, type PointTuple, addAngle, circleRadiusFactor, compassDirectionFromSlider, compassDirections, compassToDegrees, convertCoordX, convertCoordY, convertInvCoordX, convertInvCoordY, coordinateAdjust, currentServerDateMonth, currentServerDateYear, currentServerStartDate, currentServerStartDateTime, degreesFullCircle, degreesHalfCircle, degreesPerDirection, degreesPerSecond, degreesQuarterCircle, degreesToCompass, degreesToCompassSlider, degreesToRadians, displayCompassAndDegrees, distanceMapSize, distancePoints, getAngle, getCurrentServerStart, getDistance, getNextServerStart, getPortBattleTime, getPreviousServerStart, getRadians, hoursPerDay, isCardinal, isCardinalOrIntercardinal, mapSize, maxPortBattleHour, minDeepWaterBR, numberSegments, previousServerStartDate, radiansToDegrees, rotationAngleInDegrees, rotationAngleInRadians, segmentRadians, serverMaintenanceHour, speedFactor, subtractFromWind, subtractFromWindAlt, timeFactor };
//# sourceMappingURL=na.d.ts.map