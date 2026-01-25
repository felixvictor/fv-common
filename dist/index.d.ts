import Color, { Coords } from "colorjs.io";
import "dayjs/locale/de.js";
import "dayjs/locale/en.js";
import "dayjs/locale/en-gb.js";
import dayjs, { Dayjs } from "dayjs";

//#region src/chunkify.d.ts
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
declare class ColourScaleGenerator {
  #private;
  constructor(maxScaleNumber: number, baseHue: number, minChroma: number, maxChroma: number, backgroundY: number);
  computeColour(scaleNumber: number): HslColour;
}
//#endregion
//#region src/colour/colour-math.d.ts
declare const backgroundLightnessThreshold: 0.18;
declare const chromaCurveFactor: 4;
declare const cieExponent: number;
declare const cieMultiplierHigh: 116;
declare const cieMultiplierLow: 903.2962962;
declare const cieOffset: 16;
declare const cieThreshold: 0.0088564516;
declare const hueShiftFactor: 5;
declare const lightnessContrastExponent: 3.04;
declare const lightnessContrastOffset: 0.05;
declare const lightnessMax: 1;
declare const lightnessMin: 0;
declare const lightnessScaleFactor: 100;
declare const applyToeCurve: (lightness: number) => number;
declare const yToLightness: (y: number) => number;
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
declare const datetimeFormat = "YYYY-MM-DD HH:mm";
//#endregion
//#region src/date/date.d.ts
declare const setDateLocale: (locale: string) => void;
declare const getFormattedDate: (date: string, locale?: string) => string;
declare const getFormattedDateShort: (date: number | string, locale?: string) => string;
declare const getFormattedShortDateFromUTC: (date: Date | string, locale?: string) => string;
declare const getFormattedDateShortSeconds: (date: number | string, locale?: string) => string;
declare const getDateDistance: (date: string, locale?: string) => string;
declare const isDateInRange: (date: Date, hours: number) => boolean;
declare const isFutureDate: (date: Date | string) => boolean;
declare const closestDateIndex: (datesString: string[]) => number | undefined;
declare const getRelativeTime: (time: string) => string;
declare const isPastDate: (time: string) => boolean;
declare const formatDate: (time: string) => string;
declare const formatTime: (time: string) => string;
declare const formatLocalDate: (time: string) => string;
declare const formatLocalTime: (time: string) => string;
declare const isBetweenTime: (time: string | undefined, begin: Dayjs, end: Dayjs) => boolean;
declare const getRange: (dateRange: Date[]) => {
  begin: Dayjs;
  end: Dayjs;
};
declare const getLocalHour: (hour: number) => number;
declare const formatFromToTime: (from: number, to: number) => string;
declare const formatTimeRange: (from: number, to: number) => string;
declare const convertDEDateString: (date: string) => string;
//#endregion
//#region src/date/ticks.d.ts
declare const getTimeFromTicks: (ticks: bigint | number | string) => string;
declare const getDateFromTicks: (ticks: bigint | number) => dayjs.Dayjs;
declare const getTicksFromDate: (date: dayjs.Dayjs | number) => bigint;
declare const getTimestampFromTicks: (ticks: bigint | number | string) => number;
//#endregion
//#region src/delay.d.ts
declare const delay: (ms: number) => Promise<unknown>;
//#endregion
//#region src/fetch.d.ts
declare const loadFile: <T = unknown>(path: string) => Promise<T>;
//#endregion
//#region src/format/cardinal.d.ts
declare const getCardinalRules: (locale: string) => Intl.PluralRules;
//#endregion
//#region src/format/email.d.ts
declare const convertNameForEmail: (name: string) => string;
//#endregion
//#region src/format/helpers.d.ts
declare const addSpan: (suffix: string, svg: boolean) => string;
declare const beautifySuffix: (suffix: string, svg: boolean) => string;
declare const formatUnit: (u: string, svg?: boolean) => string;
declare const truncate: (string: string, n: number) => string;
//#endregion
//#region src/format/intl.d.ts
declare const formatWithIntl: (value: number, options: Intl.NumberFormatOptions, svg?: boolean) => string;
//#endregion
//#region src/format/number.d.ts
declare const formatFloat: (value: number, decimals?: number, options?: Intl.NumberFormatOptions, svg?: boolean) => string;
declare const formatSignFloat: (value: number, decimals?: number) => string;
declare const formatSiFloat: (value: number, svg?: boolean) => string;
declare const formatFloatFixed: (value: number, decimals?: number) => string;
declare const formatFloatWithUnit: (x: number, u: string) => string;
declare const formatReales: (x: number) => string;
declare const formatWeight: (x: number) => string;
declare const round: (n: number, d?: number) => number;
declare const roundToThousands: (value: number) => number;
declare const formatInt: (value: number, options?: Intl.NumberFormatOptions) => string;
declare const formatSignInt: (value: number) => string;
declare const formatSiInt: (x: number, max?: number, options?: Intl.NumberFormatOptions) => string;
//#endregion
//#region src/format/ordinal.d.ts
declare const getOrdinal: (n: number, sup?: boolean, locale?: string) => string;
//#endregion
//#region src/format/percent.d.ts
declare const formatPercent: (value: number, decimals?: number, options?: Intl.NumberFormatOptions) => string;
declare const formatSignPercent: (value: number, decimals?: number) => string;
declare const formatPP: (x: number, f?: number) => string;
//#endregion
//#region src/format/text.d.ts
declare const capitalizeFirstLetter: (text: string, locale?: string) => string;
declare const pluralise: (count: number, wordSingle: string, wordPlural?: string) => string;
//#endregion
//#region src/html.d.ts
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
declare const getElementHeight: (element: HTMLElement | SVGElement) => number;
declare const getElementWidth: (element: HTMLElement | SVGElement) => number;
declare const getElementDimensions: (element: HTMLElement | SVGElement) => {
  height: number;
  width: number;
};
declare const getElementDimensionsPrecise: (element: HTMLElement | SVGElement) => {
  height: number;
  width: number;
};
//#endregion
//#region src/locale.d.ts
declare const setLocale: (locale: string) => void;
declare const getLocale: () => string;
declare const onLocaleChange: (callback: () => void) => void;
//#endregion
//#region src/math/common.d.ts
declare const between: (value: number, a: number, b: number, inclusive?: boolean) => boolean;
//#endregion
//#region src/math/find-segment.d.ts
interface CurvePoint {
  tangentIn: number;
  tangentOut: number;
  time: number;
  value: number;
}
declare const getCurveValue: (time: number, points: CurvePoint[]) => number | undefined;
declare const getCurveValueClamped: (time: number, points: CurvePoint[]) => number;
//#endregion
//#region src/math/power.d.ts
declare const nearestPow2: (value: number) => number;
declare const nextPow2: (value: number) => number;
//#endregion
//#region src/sort.d.ts
type SortArgument<T> = `-${keyof T & string}` | keyof T;
declare const sortBy: <T extends object>(propertyNames: SortArgument<T>[]) => (a: T, b: T) => number;
declare function simpleNumberSort(a: number, b: number): number;
declare function simpleNumberSort(a: null | number | undefined, b: null | number | undefined): number;
declare function simpleStringSort(a: string, b: string): number;
declare function simpleStringSort(a: null | string | undefined, b: null | string | undefined): number;
//#endregion
//#region src/svg/draw.d.ts
declare const drawSvgCircle: (x: number, y: number, r: number) => string;
declare const drawSvgRect: (x: number, y: number, size: number) => string;
declare const drawSvgRectWH: (x: number, y: number, width: number, height: number) => string;
declare const drawSvgVLine: (x: number, y: number, length: number) => string;
declare const drawSvgHLine: (x: number, y: number, length: number) => string;
declare const drawSvgLine: (x1: number, y1: number, x2: number, y2: number) => string;
//#endregion
//#region src/svg/optimise.d.ts
declare const optimisePath: (path: string) => string;
//#endregion
//#region src/unicode.d.ts
declare const cCaretRight: string;
declare const cCircleWhite: string;
declare const cCombiningDiaeresis: string;
declare const cDashEm: string;
declare const cDashEn: string;
declare const cDashFigure: string;
declare const cDashNoBreak: string;
declare const cInfo: string;
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
//#region src/url.d.ts
declare const createUrl: (options: {
  host: string;
  path?: string;
  port?: number | string;
  protocol: string;
}, name?: string) => URL;
//#endregion
export { ColourScaleGenerator, ColourUtility, type CurvePoint, HslColour, type SortArgument, addSpan, applyToeCurve, backgroundLightnessThreshold, beautifySuffix, between, cCaretRight, cCircleWhite, cCombiningDiaeresis, cDashEm, cDashEn, cDashFigure, cDashNoBreak, cInfo, cMinus, cPlus, cPlusSmall, cSmallDot, cSpace, cSpaceFigure, cSpaceNarrowNoBreaking, cSpaceNoBreak, cSpacePunctuation, cSpaceThin, cSpaceZeroWidthBreaking, cSpaceZeroWidthNoBreak, capitalizeFirstLetter, chromaCurveFactor, chunkify, cieExponent, cieMultiplierHigh, cieMultiplierLow, cieOffset, cieThreshold, clamp, closestDateIndex, convertDEDateString, convertNameForEmail, createUrl, datetimeFormat, delay, drawSvgCircle, drawSvgHLine, drawSvgLine, drawSvgRect, drawSvgRectWH, drawSvgVLine, formatDate, formatFloat, formatFloatFixed, formatFloatWithUnit, formatFromToTime, formatInt, formatLocalDate, formatLocalTime, formatPP, formatPercent, formatReales, formatSiFloat, formatSiInt, formatSignFloat, formatSignInt, formatSignPercent, formatTime, formatTimeRange, formatUnit, formatWeight, formatWithIntl, getCardinalRules, getCurveValue, getCurveValueClamped, getDateDistance, getDateFromTicks, getElementDimensions, getElementDimensionsPrecise, getElementHeight, getElementRect, getElementWidth, getFormattedDate, getFormattedDateShort, getFormattedDateShortSeconds, getFormattedShortDateFromUTC, getLocalHour, getLocale, getOrdinal, getRange, getRelativeTime, getTicksFromDate, getTimeFromTicks, getTimestampFromTicks, hueShiftFactor, isBetweenTime, isDateInRange, isEmpty, isFutureDate, isPastDate, lightnessContrastExponent, lightnessContrastOffset, lightnessMax, lightnessMin, lightnessScaleFactor, loadFile, nearestPow2, nextPow2, onLocaleChange, optimisePath, pluralise, round, roundToThousands, setDateLocale, setLocale, simpleNumberSort, simpleStringSort, sortBy, truncate, yToLightness };
//# sourceMappingURL=index.d.ts.map