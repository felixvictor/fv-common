import Color, { Coords } from "colorjs.io";
import "dayjs/locale/de";
import "dayjs/locale/en";

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
//#endregion
//#region src/date.d.ts
/**
 * Sets the active locale for date formatting.
 * @param locale - ISO locale code ('de' or 'en')
 */
declare const setLocale: (locale: "de" | "en") => void;
/**
 * Gets the current active locale.
 */
declare const getLocale: () => string;
/**
 * Formats date with locale-specific formatting.
 * @example getFormattedDate('2024-01-15') → "Montag, 15. Januar, 14.30" (de)
 */
declare const getFormattedDate: (date: string) => string;
/**
 * Short date format with day, month, and time.
 * @example getFormattedDateShort('2024-01-15') → "15.1. 14.30"
 */
declare const getFormattedDateShort: (date: number | string) => string;
/**
 * Date format with seconds included.
 * @example getFormattedDateShortSeconds('2024-01-15') → "15. Januar 14.30.45"
 */
declare const getFormattedDateShortSeconds: (date: number | string) => string;
/**
 * Returns relative time string (e.g., "vor 2 Stunden" or "2 hours ago").
 * Uses currently active locale.
 */
declare const getDateDistance: (date: string) => string;
/**
 * Checks if the given date is in the future.
 */
declare const isFutureDate: (date: Date | string) => boolean;
/**
 * Finds the index of the date closest to now.
 * @returns Index of closest date, or undefined if array is empty
 */
declare const closestDateIndex: (datesString: string[]) => number | undefined;
//#endregion
//#region src/delay.d.ts
declare const delay: (ms: number) => Promise<unknown>;
//#endregion
//#region src/format/intl-helpers.d.ts
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
//#endregion
//#region src/format/text.d.ts
/**
 * Capitalizes the first letter of a string.
 * @link https://stackoverflow.com/a/1026087
 * @example capitalizeFirstLetter("hello") → "Hello"
 */
declare const capitalizeFirstLetter: (text: string) => string;
/**
 * Returns the appropriate singular or plural form based on count.
 * Uses Intl.PluralRules for locale-aware pluralization.
 * @example pluralise(1, "item", "items") → "item"
 * @example pluralise(5, "item", "items") → "items"
 */
declare const pluralise: (count: number, wordSingle: string, wordPlural: string) => string;
//#endregion
//#region src/html.d.ts
declare const getElementWidth: (element: HTMLElement | SVGElement) => number;
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
declare const drawSvgRect: (x: number, y: number, h: number, w: number) => string;
declare const drawSvgLine: (x1: number, y1: number, x2: number, y2: number) => string;
declare const drawSvgVLine: (x: number, y: number, l: number) => string;
declare const drawSvgHLine: (x: number, y: number, l: number) => string;
//#endregion
//#region src/svg/optimise.d.ts
declare const optimisePath: (path: string) => string;
//#endregion
//#region src/unicode.d.ts
declare const cDashEm: string;
declare const cDashEn: string;
declare const cDashFigure: string;
declare const cMinus: string;
declare const cPlus: string;
declare const cPlusSmall: string;
declare const cSpaceFigure: string;
declare const cSpaceNarrowNoBreaking: string;
declare const cSpaceNoBreak: string;
declare const cSpacePunctuation: string;
declare const cSpaceThin: string;
declare const cSpaceZeroWidthBreaking: string;
declare const cCombiningDiaeresis: string;
//#endregion
export { ColourMath, ColourScaleGenerator, ColourUtility, HslColour, type SortArgument, cCombiningDiaeresis, cDashEm, cDashEn, cDashFigure, cMinus, cPlus, cPlusSmall, cSpaceFigure, cSpaceNarrowNoBreaking, cSpaceNoBreak, cSpacePunctuation, cSpaceThin, cSpaceZeroWidthBreaking, capitalizeFirstLetter, clamp, closestDateIndex, delay, drawSvgHLine, drawSvgLine, drawSvgRect, drawSvgVLine, formatFloat, formatFloatFixed, formatInt, formatPercent, formatSiFloat, formatSignFloat, formatSignInt, formatSignPercent, formatWithIntl, getDateDistance, getElementWidth, getFormattedDate, getFormattedDateShort, getFormattedDateShortSeconds, getLocale, isFutureDate, optimisePath, pluralise, round, roundToThousands, setLocale, simpleNumberSort, simpleStringSort, sortBy };
//# sourceMappingURL=index.d.ts.map