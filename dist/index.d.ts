import Color, { Coords } from "colorjs.io";
import "dayjs/locale/de";
import "dayjs/locale/en";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/en-gb";

//#region src/chunkify.d.ts

/**
 * Splits an array into n pieces.
 *
 * @param array - The source array to be split.
 * @param n - The number of pieces to create (must be >= 1).
 * @param balanced - If true, chunk sizes differ by at most 1 element.
 *                    If false, creates n-1 equal chunks with remainder in the last chunk.
 * @returns An array of n (or fewer) arrays containing the split pieces.
 * @throws {Error} If n is less than 1.
 *
 * @example
 * // Balanced split (default)
 * chunkify([1,2,3,4,5,6,7], 3) // [[1,2,3], [4,5], [6,7]]
 *
 * @example
 * // Unbalanced split
 * chunkify([1,2,3,4,5,6,7], 3, false) // [[1,2], [3,4], [5,6,7]]
 */
declare const chunkify: <T>(array: T[], n: number, balanced?: boolean) => T[][];
//#endregion
//#region src/colour/hsl-colour.d.ts
declare class HslColour {
  #private;
  static readonly colorSpace = "okhsl";
  static readonly hexFormat = "hex";
  static readonly hueMax = 360;
  static readonly hueMin = 0;
  static readonly lightnessMax = 100;
  static readonly lightnessMin = 0;
  static readonly outputColorSpace = "srgb";
  static readonly saturationMax = 100;
  static readonly saturationMin = 0;
  get colourObject(): Color;
  get h(): number;
  set h(value: number | string);
  get hex(): string;
  get l(): number;
  set l(value: number | string);
  get s(): number;
  set s(value: number | string);
  constructor(argument: Color | Coords | string);
  static mix(color1: HslColour, color2: HslColour, weight: number): HslColour;
  clone(): HslColour;
  toString(): string;
}
//#endregion
//#region src/colour/colour-at-scale.d.ts
/**
 * {@link https://matthewstrom.com/writing/generating-color-palettes/}
 *
 * Utility class for perceptually-designed HSL color scale generation.
 * Based on Matthew Ström's color palette generation algorithm.
 */
declare class ColourScaleGenerator {
  #private;
  constructor(maxScaleNumber: number, baseHue: number, minChroma: number, maxChroma: number, backgroundY: number);
  computeColour(scaleNumber: number): HslColour;
}
//#endregion
//#region src/colour/colour-math.d.ts
declare class ColourMath {
  static readonly backgroundLightnessThreshold = 0.18;
  static readonly chromaCurveFactor = 4;
  static readonly cieExponent: number;
  static readonly cieMultiplierHigh = 116;
  static readonly cieMultiplierLow = 903.2962962;
  static readonly cieOffset = 16;
  static readonly cieThreshold = 0.0088564516;
  static readonly hueShiftFactor = 5;
  static readonly lightnessContrastExponent = 3.04;
  static readonly lightnessContrastOffset = 0.05;
  static readonly lightnessMax = 1;
  static readonly lightnessMin = 0;
  static readonly lightnessScaleFactor = 100;
  static readonly toeK1 = 0.206;
  static readonly toeK2 = 0.03;
  static readonly toeK3: number;
  static applyToeCurve(lightness: number): number;
  static yToLightness(y: number): number;
}
//#endregion
//#region src/colour/colour-utility.d.ts
declare class ColourUtility {
  #private;
  static readonly defaultBaseTint = 40;
  static readonly defaultHarmonizationMix = 80;
  static readonly fallbackHue = 0;
  static readonly fallbackLightness = 0;
  static readonly fallbackSaturation = 1;
  static readonly maxSaturation = 0.25;
  static readonly maxSaturationNeutral = 0.2;
  static readonly maxTone = 100;
  static readonly minSaturation = 0;
  static readonly neutralHarmonizationMix = 0;
  static readonly onDarkBase = "#fff";
  static readonly onDarkMixAmount = 5;
  static readonly onLightBase = "#000";
  static readonly onLightMixAmount = 40;
  static readonly percentageScale = 100;
  get baseTint(): number;
  get onDark(): HslColour;
  get onLight(): HslColour;
  constructor(baseColourHex: string, baseTint?: number);
  colourMixin(mixColour: HslColour | string, mixAmount?: number): HslColour;
  getBaseTintedColour(colourHex: string): HslColour;
  getColourAtTint(tone: number, colour: HslColour, background: HslColour, neutral?: boolean): HslColour;
  getHarmonisedColour(colourHex: string, mixAmount?: number): HslColour;
  getHarmonisedColourNeutral(colourHex: string): HslColour;
  getTint(colour: HslColour, tone: number, backgroundColour?: HslColour, neutral?: boolean): HslColour;
  mixColours(color1: HslColour, color2: HslColour, weightPercentage?: number): HslColour;
}
//#endregion
//#region src/common.d.ts
declare const clamp: (x: number | string, min: number | string, max: number | string) => number;
declare const isEmpty: (object: null | Record<string, unknown> | undefined) => boolean;
//#endregion
//#region src/date/constants.d.ts
/**
 * Standard datetime format used throughout the application.
 */
declare const datetimeFormat = "YYYY-MM-DD HH:mm";
//#endregion
//#region src/date/date.d.ts
declare const setDateLocale: (locale: string) => void;
/**
 * Formats date with locale-specific formatting.
 * @param date - Date string to format
 * @param locale - Optional locale override
 * @example getFormattedDate('2024-01-15') → "Montag, 15. Januar, 14.30" (de)
 * @example getFormattedDate('2024-01-15', 'en') → "Monday, 15. January, 14.30"
 */
declare const getFormattedDate: (date: string, locale?: string) => string;
/**
 * Short date format with day, month, and time.
 * @example getFormattedDateShort('2024-01-15') → "15.1. 14.30"
 */
declare const getFormattedDateShort: (date: number | string, locale?: string) => string;
/**
 * Date format with seconds included.
 * @example getFormattedDateShortSeconds('2024-01-15') → "15. Januar 14.30.45"
 */
declare const getFormattedDateShortSeconds: (date: number | string, locale?: string) => string;
/**
 * Returns relative time string (e.g., "vor 2 Stunden" or "2 hours ago").
 * Uses currently active locale.
 */
declare const getDateDistance: (date: string, locale?: string) => string;
/**
 * Checks if the given date is in the future.
 */
declare const isFutureDate: (date: Date | string) => boolean;
/**
 * Finds the index of the date closest to now.
 * @returns Index of closest date, or undefined if array is empty
 */
declare const closestDateIndex: (datesString: string[]) => number | undefined;
/**
 * Formats a datetime string as relative time (e.g., "2 hours ago").
 *
 * @param time - Datetime string in YYYY-MM-DD HH:mm format.
 * @returns Relative time string.
 *
 * @example
 * getRelativeTime("2024-01-15 10:00") // "2 hours ago"
 */
declare const getRelativeTime: (time: string) => string;
/**
 * Checks if a datetime is in the past (or current moment).
 *
 * @param time - Datetime string in YYYY-MM-DD HH:mm format.
 * @returns True if the time is same or before now.
 *
 * @example
 * isPastDate("2024-01-15 10:00") // true if current time is after this
 */
declare const isPastDate: (time: string) => boolean;
/**
 * Formats a datetime string in UTC.
 *
 * @param time - Datetime string in YYYY-MM-DD HH:mm format.
 * @returns Formatted UTC datetime string.
 *
 * @example
 * formatDate("2024-01-15 10:00") // "2024-01-15 10:00"
 */
declare const formatDate: (time: string) => string;
/**
 * Formats a datetime string as time only in UTC.
 *
 * @param time - Datetime string in YYYY-MM-DD HH:mm format.
 * @returns Formatted UTC time string (H:mm).
 *
 * @example
 * formatTime("2024-01-15 10:30") // "10:30"
 */
declare const formatTime: (time: string) => string;
/**
 * Formats a datetime string in local timezone.
 *
 * @param time - Datetime string in YYYY-MM-DD HH:mm format.
 * @returns Formatted local datetime string.
 *
 * @example
 * formatLocalDate("2024-01-15 10:00") // "2024-01-15 14:00" (if local is UTC+4)
 */
declare const formatLocalDate: (time: string) => string;
/**
 * Formats a datetime string as time only in local timezone.
 *
 * @param time - Datetime string in YYYY-MM-DD HH:mm format.
 * @returns Formatted local time string (H:mm).
 *
 * @example
 * formatLocalTime("2024-01-15 10:00") // "14:00" (if local is UTC+4)
 */
declare const formatLocalTime: (time: string) => string;
/**
 * Checks if a time falls within a given range.
 *
 * @param time - Datetime string in YYYY-MM-DD HH:mm format (or undefined).
 * @param begin - Start of the time range.
 * @param end - End of the time range.
 * @returns True if time is within range (exclusive start, inclusive end).
 *
 * @example
 * const begin = dayjs("2024-01-15 10:00")
 * const end = dayjs("2024-01-15 20:00")
 * isBetweenTime("2024-01-15 15:00", begin, end) // true
 */
declare const isBetweenTime: (time: string | undefined, begin: Dayjs, end: Dayjs) => boolean;
/**
 * Converts a date range array to begin/end Dayjs objects.
 *
 * @param dateRange - Array of Date objects.
 * @returns Object with begin and end Dayjs objects.
 *
 * @example
 * const dates = [new Date("2024-01-01"), new Date("2024-01-31")]
 * const { begin, end } = getRange(dates)
 */
declare const getRange: (dateRange: Date[]) => {
  begin: Dayjs;
  end: Dayjs;
};
/**
 * Converts a UTC hour to local hour.
 *
 * @param hour - Hour in UTC (0-23).
 * @returns Hour in local timezone (0-23).
 */
declare const getLocalHour: (hour: number) => number;
/**
 * Formats a time range as HTML with non-breaking spaces.
 *
 * @param from - Starting hour.
 * @param to - Ending hour.
 * @returns HTML string with formatted time range.
 */
declare const formatFromToTime: (from: number, to: number) => string;
/**
 * Formats a time range showing both UTC and local times.
 *
 * @param from - Starting hour in UTC.
 * @param to - Ending hour in UTC.
 * @returns HTML string with UTC and local time ranges.
 */
declare const formatTimeRange: (from: number, to: number) => string;
//#endregion
//#region src/date/ticks.d.ts
/**
 * Converts .NET DateTime ticks to a formatted date-time string.
 *
 * @param ticks - The time in .NET ticks (100-nanosecond intervals since 0001-01-01).
 * @returns Formatted date-time string in UTC (YYYY-MM-DD HH:mm).
 *
 * @example
 * // Convert .NET DateTime.Now.Ticks to readable format
 * getTimeFromTicks(638400000000000000) // "2024-01-15 10:30"
 */
declare const getTimeFromTicks: (ticks: bigint | number | string) => string;
/**
 * Converts .NET DateTime ticks to a Day.js object.
 *
 * @param ticks - The time in .NET ticks (100-nanosecond intervals since 0001-01-01).
 * @returns A Day.js object in UTC.
 *
 * @example
 * const date = getDateFromTicks(638400000000000000)
 * console.log(date.format("YYYY-MM-DD"))
 */
declare const getDateFromTicks: (ticks: bigint | number) => dayjs.Dayjs;
/**
 * Converts a Day.js object or timestamp to .NET DateTime ticks.
 *
 * @param date - A Day.js object or Unix timestamp in milliseconds.
 * @returns The time in .NET ticks.
 *
 * @example
 * const ticks = getTicksFromDate(dayjs())
 * const ticks2 = getTicksFromDate(Date.now())
 */
declare const getTicksFromDate: (date: dayjs.Dayjs | number) => bigint;
/**
 * Converts .NET DateTime ticks to a Unix timestamp in milliseconds.
 *
 * @param ticks - The time in .NET ticks (100-nanosecond intervals since 0001-01-01).
 * @returns Unix timestamp in milliseconds.
 *
 * @example
 * const timestamp = getTimestampFromTicks(638400000000000000)
 * const date = new Date(timestamp)
 */
declare const getTimestampFromTicks: (ticks: bigint | number | string) => number;
//#endregion
//#region src/delay.d.ts
declare const delay: (ms: number) => Promise<unknown>;
//#endregion
//#region src/format/cardinal.d.ts
declare const getCardinalRules: (locale: string) => Intl.PluralRules;
//#endregion
//#region src/format/helpers.d.ts
/**
 * Adds styled span/tspan wrapper for compact notation suffixes.
 */
declare const addSpan: (suffix: string, svg: boolean) => string;
/**
 * Beautifies compact notation suffixes (K, M) with styling and spacing.
 */
declare const beautifySuffix: (suffix: string, svg: boolean) => string;
declare const formatUnit: (u: string, svg?: boolean) => string;
//#endregion
//#region src/format/intl.d.ts
/**
 * Internal number formatter using Intl.NumberFormat with custom typographic enhancements.
 * Applies thin spaces, proper minus signs, and styled compact notation.
 */
declare const formatWithIntl: (value: number, options: Intl.NumberFormatOptions, svg?: boolean) => string;
//#endregion
//#region src/format/number.d.ts
/**
 * Formats a floating-point number with specified decimal places.
 * @example formatFloat(1234.5678, 2) → "1 234.57"
 */
declare const formatFloat: (value: number, decimals?: number, options?: Intl.NumberFormatOptions, svg?: boolean) => string;
/**
 * Formats a float with explicit sign (+/-).
 * @example formatSignFloat(42.5, 2) → "+42.50"
 * @example formatSignFloat(-42.5, 2) → "−42.50"
 */
declare const formatSignFloat: (value: number, decimals?: number) => string;
/**
 * Formats a number with SI compact notation (K, M suffixes).
 * @example formatSiFloat(1234567) → "1.2 m" (where m is styled)
 */
declare const formatSiFloat: (value: number, svg?: boolean) => string;
/**
 * Formats a float with fixed decimal places, using figure spaces for missing digits.
 * Ensures alignment in tabular data by replacing trailing zeros with figure spaces.
 * @example formatFloatFixed(42, 2) → "42  " (with figure spaces)
 * @example formatFloatFixed(42.1, 2) → "42.1 " (with one figure space)
 */
declare const formatFloatFixed: (value: number, decimals?: number) => string;
declare const formatFloatWithUnit: (x: number, u: string) => string;
declare const formatReales: (x: number) => string;
declare const formatWeight: (x: number) => string;
/**
 * Rounds a number to specified decimal places.
 * @example round(3.14159, 2) → 3.14
 */
declare const round: (value: number, decimals?: number) => number;
/**
 * Rounds a number to 3 decimal places (thousands precision).
 * @example roundToThousands(3.14159) → 3.142
 */
declare const roundToThousands: (value: number) => number;
/**
 * Formats an integer (no decimal places).
 * @example formatInt(1234567) → "1 234 567"
 */
declare const formatInt: (value: number, options?: Intl.NumberFormatOptions) => string;
/**
 * Formats an integer with explicit sign (+/-).
 * @example formatSignInt(42) → "+42"
 */
declare const formatSignInt: (value: number) => string;
/**
 * Format integer
 */
declare const formatSiInt: (x: number, max?: number, options?: Intl.NumberFormatOptions) => string;
//#endregion
//#region src/format/ordinal.d.ts
/**
 * Format ordinal number with appropriate suffix.
 * @param n - Integer
 * @param sup - True if superscript suffixes needed
 * @param locale - Optional locale override
 * @example getOrdinal(1) → "1ˢᵗ"
 * @example getOrdinal(2, false) → "2nd"
 * @example getOrdinal(3) → "3ʳᵈ"
 */
declare const getOrdinal: (n: number, sup?: boolean, locale?: string) => string;
//#endregion
//#region src/format/percent.d.ts
/**
 * Formats a decimal value as a percentage.
 * @param value - Decimal value (e.g., 0.42 for 42%)
 * @param decimals - Number of decimal places
 * @example formatPercent(0.4567, 1) → "45.7 %"
 */
declare const formatPercent: (value: number, decimals?: number, options?: Intl.NumberFormatOptions) => string;
/**
 * Formats a percentage with explicit sign (+/-).
 * @example formatSignPercent(0.42, 1) → "+42.0 %"
 */
declare const formatSignPercent: (value: number, decimals?: number) => string;
/**
 * Format percentage point
 */
declare const formatPP: (x: number, f?: number) => string;
//#endregion
//#region src/format/text.d.ts
/**
 * Capitalizes the first letter of a string using locale-aware rules.
 * @example capitalizeFirstLetter("hello") → "Hello"
 * @example capitalizeFirstLetter("istanbul") → "İstanbul" (in Turkish locale)
 */
declare const capitalizeFirstLetter: (text: string, locale?: string) => string;
/**
 * Returns the appropriate singular or plural form based on count.
 * Uses Intl.PluralRules for locale-aware pluralisation.
 * @example pluralise(1, "item", "items") → "item"
 * @example pluralise(5, "item", "items") → "items"
 */
declare const pluralise: (count: number, wordSingle: string, wordPlural?: string) => string;
//#endregion
//#region src/html.d.ts
/**
 * Gets the bounding rectangle with all dimensions floored.
 * This is the base function that other utilities build upon.
 *
 * @param element - The HTML or SVG element to measure.
 * @returns A DOMRect-like object with all values floored to integers.
 *
 * @example
 * const rect = getElementRect(document.getElementById('myDiv'))
 * console.log(rect.top, rect.left, rect.width, rect.height)
 */
declare const getElementRect: (element: HTMLElement | SVGElement) => {
  bottom: number;
  height: number;
  left: number;
  right: number;
  top: number;
  width: number;
  x: number;
  y: number;
};
/**
 * Gets the height of an element in pixels (floored to nearest integer).
 *
 * @param element - The HTML or SVG element to measure.
 * @returns The floored height in pixels, including padding and borders.
 *
 * @example
 * const height = getElementHeight(document.getElementById('myDiv'))
 */
declare const getElementHeight: (element: HTMLElement | SVGElement) => number;
/**
 * Gets the width of an element in pixels (floored to nearest integer).
 *
 * @param element - The HTML or SVG element to measure.
 * @returns The floored width in pixels, including padding and borders.
 *
 * @example
 * const width = getElementWidth(document.getElementById('myDiv'))
 */
declare const getElementWidth: (element: HTMLElement | SVGElement) => number;
/**
 * Gets both width and height of an element in pixels (floored to nearest integers).
 *
 * @param element - The HTML or SVG element to measure.
 * @returns An object containing floored width and height in pixels.
 *
 * @example
 * const { width, height } = getElementDimensions(document.getElementById('myDiv'))
 */
declare const getElementDimensions: (element: HTMLElement | SVGElement) => {
  height: number;
  width: number;
};
/**
 * Gets precise (non-floored) dimensions of an element.
 *
 * @param element - The HTML or SVG element to measure.
 * @returns An object containing precise width and height in pixels.
 *
 * @example
 * const { width, height } = getElementDimensionsPrecise(document.getElementById('myDiv'))
 * // Returns fractional pixels: { width: 150.5, height: 200.75 }
 */
declare const getElementDimensionsPrecise: (element: HTMLElement | SVGElement) => {
  height: number;
  width: number;
};
//#endregion
//#region src/locale.d.ts
declare const setLocale: (locale: string) => void;
declare const getLocale: () => string;
/**
 * Register a callback to be called whenever the locale changes.
 * @param callback - Function to call on locale change
 */
declare const onLocaleChange: (callback: () => void) => void;
//#endregion
//#region src/math/common.d.ts
/**
 * Tests if a number is between two bounds (order-independent).
 *
 * @param value - The number to test.
 * @param a - First bound (can be min or max).
 * @param b - Second bound (can be min or max).
 * @param inclusive - If true, bounds are included in the range. Default is true.
 * @returns True if value is within the range defined by a and b.
 *
 * @example
 * between(5, 1, 10) // true
 * between(5, 10, 1) // true (order-independent)
 * between(1, 1, 10) // true (inclusive by default)
 * between(1, 1, 10, false) // false (exclusive)
 */
declare const between: (value: number, a: number, b: number, inclusive?: boolean) => boolean;
//#endregion
//#region src/math/find-segment.d.ts
/**
 * Represents a point on a cubic Hermite spline curve.
 */
interface CurvePoint {
  /** Incoming tangent (derivative at this point from the left) */
  tangentIn: number;
  /** Outgoing tangent (derivative at this point to the right) */
  tangentOut: number;
  /** Time coordinate (x-axis) */
  time: number;
  /** Value coordinate (y-axis) */
  value: number;
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
declare const getCurveValue: (time: number, points: CurvePoint[]) => number | undefined;
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
declare const getCurveValueClamped: (time: number, points: CurvePoint[]) => number;
//#endregion
//#region src/math/power.d.ts
/**
 * Calculates the largest power of 2 that is less than or equal to the given number.
 *
 * @param value - The input number (must be positive).
 * @returns The largest power of 2 ≤ value.
 * @throws {Error} If value is not a positive number.
 *
 * @example
 * nearestPow2(100) // 64 (2^6)
 * nearestPow2(64)  // 64 (2^6)
 * nearestPow2(65)  // 64 (2^6)
 * nearestPow2(7)   // 4 (2^2)
 */
declare const nearestPow2: (value: number) => number;
/**
 * Calculates the smallest power of 2 that is greater than or equal to the given number.
 *
 * @param value - The input number (must be positive).
 * @returns The smallest power of 2 ≥ value.
 * @throws {Error} If value is not a positive number.
 *
 * @example
 * nextPow2(100) // 128 (2^7)
 * nextPow2(64)  // 64 (2^6)
 * nextPow2(65)  // 128 (2^7)
 */
declare const nextPow2: (value: number) => number;
//#endregion
//#region src/sort.d.ts
/**
 * Sort argument type.
 * keyof T for ascending, `-${string & keyof T}` for descending.
 */
type SortArgument<T> = `-${keyof T & string}` | keyof T;
/**
 * Sort by a list of properties (in left-to-right order)
 * Properties prefixed with '-' are sorted in descending order
 * @example sortBy(['name', '-age']) // Sort by name ascending, then age descending
 */
declare const sortBy: <T extends object>(propertyNames: SortArgument<T>[]) => (a: T, b: T) => number;
/**
 * Simple number comparison with null/undefined handling (pushes nullish values to the end).
 */
declare function simpleNumberSort(a: number, b: number): number;
declare function simpleNumberSort(a: null | number | undefined, b: null | number | undefined): number;
/**
 * Simple string comparison with null/undefined handling (pushes nullish values to the end).
 */
declare function simpleStringSort(a: string, b: string): number;
declare function simpleStringSort(a: null | string | undefined, b: null | string | undefined): number;
//#endregion
//#region src/svg/draw.d.ts
/**
 * Generates an SVG path string for a circle.
 * Uses arc commands to draw two semicircles.
 *
 * @param x - Center x-coordinate.
 * @param y - Center y-coordinate.
 * @param r - Radius.
 * @returns SVG path data string.
 *
 * @example
 * <path d={drawSvgCircle(50, 50, 20)} />
 * // Draws a circle centered at (50, 50) with radius 20
 */
declare const drawSvgCircle: (x: number, y: number, r: number) => string;
/**
 * Generates an SVG path string for a rectangle.
 * The rectangle is centered at (x, y).
 *
 * @param x - Center x-coordinate.
 * @param y - Center y-coordinate.
 * @param size - Width and height of the rectangle.
 * @returns SVG path data string.
 *
 * @example
 * <path d={drawSvgRect(50, 50, 30)} />
 * // Draws a 30×30 square centered at (50, 50)
 */
declare const drawSvgRect: (x: number, y: number, size: number) => string;
/**
 * Generates an SVG path string for a rectangle with separate width and height.
 * The rectangle is centered at (x, y).
 *
 * @param x - Center x-coordinate.
 * @param y - Center y-coordinate.
 * @param width - Rectangle width.
 * @param height - Rectangle height.
 * @returns SVG path data string.
 *
 * @example
 * <path d={drawSvgRectWH(50, 50, 40, 20)} />
 * // Draws a 40×20 rectangle centered at (50, 50)
 */
declare const drawSvgRectWH: (x: number, y: number, width: number, height: number) => string;
/**
 * Generates an SVG path string for a vertical line.
 *
 * @param x - Starting x-coordinate.
 * @param y - Starting y-coordinate.
 * @param length - Length of the line (positive = down, negative = up).
 * @returns SVG path data string.
 *
 * @example
 * <path d={drawSvgVLine(50, 20, 60)} />
 * // Draws a vertical line from (50, 20) downward 60 units
 */
declare const drawSvgVLine: (x: number, y: number, length: number) => string;
/**
 * Generates an SVG path string for a horizontal line.
 *
 * @param x - Starting x-coordinate.
 * @param y - Starting y-coordinate.
 * @param length - Length of the line (positive = right, negative = left).
 * @returns SVG path data string.
 *
 * @example
 * <path d={drawSvgHLine(20, 50, 60)} />
 * // Draws a horizontal line from (20, 50) rightward 60 units
 */
declare const drawSvgHLine: (x: number, y: number, length: number) => string;
/**
 * Generates an SVG path string for a line between two points.
 *
 * @param x1 - Starting x-coordinate.
 * @param y1 - Starting y-coordinate.
 * @param x2 - Ending x-coordinate.
 * @param y2 - Ending y-coordinate.
 * @returns SVG path data string.
 *
 * @example
 * <path d={drawSvgLine(10, 10, 90, 90)} />
 * // Draws a line from (10, 10) to (90, 90)
 */
declare const drawSvgLine: (x1: number, y1: number, x2: number, y2: number) => string;
//#endregion
//#region src/svg/optimise.d.ts
declare const optimisePath: (path: string) => string;
//#endregion
//#region src/unicode.d.ts
declare const cCircleWhite: string;
declare const cCombiningDiaeresis: string;
declare const cDashEm: string;
declare const cDashEn: string;
declare const cDashFigure: string;
declare const cMinus: string;
declare const cPlus: string;
declare const cPlusSmall: string;
declare const cSmallDot: string;
declare const cSpace: string;
declare const cSpaceFigure: string;
declare const cSpaceNarrowNoBreaking: string;
declare const cSpaceNoBreak: string;
declare const cSpacePunctuation: string;
declare const cSpaceThin: string;
declare const cSpaceZeroWidthBreaking: string;
declare const cSpaceZeroWidthNoBreak: string;
//#endregion
export { ColourMath, ColourScaleGenerator, ColourUtility, type CurvePoint, HslColour, type SortArgument, addSpan, beautifySuffix, between, cCircleWhite, cCombiningDiaeresis, cDashEm, cDashEn, cDashFigure, cMinus, cPlus, cPlusSmall, cSmallDot, cSpace, cSpaceFigure, cSpaceNarrowNoBreaking, cSpaceNoBreak, cSpacePunctuation, cSpaceThin, cSpaceZeroWidthBreaking, cSpaceZeroWidthNoBreak, capitalizeFirstLetter, chunkify, clamp, closestDateIndex, datetimeFormat, delay, drawSvgCircle, drawSvgHLine, drawSvgLine, drawSvgRect, drawSvgRectWH, drawSvgVLine, formatDate, formatFloat, formatFloatFixed, formatFloatWithUnit, formatFromToTime, formatInt, formatLocalDate, formatLocalTime, formatPP, formatPercent, formatReales, formatSiFloat, formatSiInt, formatSignFloat, formatSignInt, formatSignPercent, formatTime, formatTimeRange, formatUnit, formatWeight, formatWithIntl, getCardinalRules, getCurveValue, getCurveValueClamped, getDateDistance, getDateFromTicks, getElementDimensions, getElementDimensionsPrecise, getElementHeight, getElementRect, getElementWidth, getFormattedDate, getFormattedDateShort, getFormattedDateShortSeconds, getLocalHour, getLocale, getOrdinal, getRange, getRelativeTime, getTicksFromDate, getTimeFromTicks, getTimestampFromTicks, isBetweenTime, isEmpty, isFutureDate, isPastDate, nearestPow2, nextPow2, onLocaleChange, optimisePath, pluralise, round, roundToThousands, setDateLocale, setLocale, simpleNumberSort, simpleStringSort, sortBy };
//# sourceMappingURL=index.d.ts.map