import Color, { Coords } from "colorjs.io";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/de.js";
import "dayjs/locale/en.js";
import "dayjs/locale/en-gb.js";
//#region src/chunkify.d.ts
declare const chunkify: <T>(array: T[], n: number, isBalanced?: boolean) => T[][];
//#endregion
//#region src/colour/colour-math.d.ts
declare const backgroundLightnessThreshold: 0.18;
declare const chromaCurveFactor: 4;
declare const cieExponent: number;
declare const cieMultiplierHigh: 1.16;
declare const cieMultiplierLow: 9.032962962;
declare const cieOffset: 0.16;
declare const cieThreshold: 0.0088564516;
declare const hueShiftFactor: 5;
declare const lightnessContrastExponentLight: 2.2;
declare const lightnessContrastExponentDark: 3.08;
declare const lightnessContrastOffset: 0.05;
declare const lightnessMin: 0;
declare const lightnessMax: 1;
declare const chromaMinOffset = 0.35;
declare const chromaMaxOffset = 0.05;
declare const applyToeCurve: (lightness: number) => number;
declare const yToLightness: (y: number) => number;
declare const luminanceY: (hex: string | undefined) => number | undefined;
declare const hueDelta: (hex1: string, hex2: string) => number;
declare const chromaMinOffsetForFloor: (hex: string, chromaFloor: number) => number;
//#endregion
//#region src/colour/okhsl-colour.d.ts
declare class okHslColour {
  #private;
  static readonly colorSpace = "okhsl";
  static readonly hexFormat = "hex";
  static readonly hueMax = 360;
  static readonly hueMin = 0;
  static readonly outputColorSpace = "srgb";
  static readonly saturationMax = 1;
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
  static mix(color1: okHslColour, color2: okHslColour, weight: number): okHslColour;
  clone(): okHslColour;
  toString(): string;
}
//#endregion
//#region src/colour/colour-scale-generator.d.ts
declare class ColourScaleGenerator {
  #private;
  constructor(maxScaleNumber: number, baseHue: number, minChroma: number, maxChroma: number, backgroundY: number);
  computeColour(scaleNumber: number): okHslColour;
}
//#endregion
//#region src/colour/constant.d.ts
declare const blackHex = "#000";
declare const whiteHex = "#fff";
//#endregion
//#region src/colour/contrast.d.ts
type ApcaTextRole = "bodyText" | "largeFluentText" | "otherContentText";
declare const wcagTextMinRatio = 4.5;
declare const wcagUiMinRatio = 3;
declare const getContrastRatio: (hex1: string, hex2: string) => number;
declare const getContrastColour: (colour: string, colourBlack?: string, colourWhite?: string) => string;
declare const getApcaContrast: (textHex: string, backgroundHex: string) => number;
declare const apcaMinLcByRole: Record<ApcaTextRole, number>;
declare const apcaMaxLcLargeFluentText = 90;
declare const apcaMinLcUiComponent = 30;
declare const isMeetingApcaContrast: (textHex: string, backgroundHex: string, role?: ApcaTextRole) => boolean;
//#endregion
//#region src/colour/make-surface.d.ts
type ThemeMode = "dark" | "light";
declare const semanticTones: {
  readonly onSurface: {
    readonly dark: {
      readonly chroma: 0.06;
      readonly lightness: 0.92;
    };
    readonly light: {
      readonly chroma: 0.1;
      readonly lightness: 0.12;
    };
  };
  readonly onSurfaceVariant: {
    readonly dark: {
      readonly chroma: 0.1;
      readonly lightness: 0.78;
    };
    readonly light: {
      readonly chroma: 0.16;
      readonly lightness: 0.32;
    };
  };
  readonly outline: {
    readonly dark: {
      readonly chroma: 0.14;
      readonly lightness: 0.62;
    };
    readonly light: {
      readonly chroma: 0.2;
      readonly lightness: 0.48;
    };
  };
  readonly outlineVariant: {
    readonly dark: {
      readonly chroma: 0.1;
      readonly lightness: 0.32;
    };
    readonly light: {
      readonly chroma: 0.14;
      readonly lightness: 0.82;
    };
  };
};
type SemanticRole = keyof typeof semanticTones;
declare const surfaceLadder: {
  readonly dark: {
    readonly anchorLightness: 0.06;
    readonly baseChroma: 0.12;
    readonly rungs: {
      readonly bright: {
        readonly chromaFactor: 1.3;
        readonly stepDelta: 2;
      };
      readonly light: {
        readonly chromaFactor: 1.1;
        readonly stepDelta: 1;
      };
      readonly main: {
        readonly chromaFactor: 1;
        readonly stepDelta: 0;
      };
      readonly variant: {
        readonly chromaFactor: 1.8;
        readonly stepDelta: 3;
      };
    };
  };
  readonly light: {
    readonly anchorLightness: 0.95;
    readonly baseChroma: 0.42;
    readonly rungs: {
      readonly bright: {
        readonly chromaFactor: 0.6;
        readonly stepDelta: 1;
      };
      readonly light: {
        readonly chromaFactor: 1.2;
        readonly stepDelta: -1;
      };
      readonly main: {
        readonly chromaFactor: 1;
        readonly stepDelta: 0;
      };
      readonly variant: {
        readonly chromaFactor: 1.5;
        readonly stepDelta: -2;
      };
    };
  };
};
type SurfaceRung = keyof typeof surfaceLadder.light.rungs;
declare class MakeSurface {
  #private;
  constructor(baseHex: string);
  calculateSurface(lightness: number, chromaFactor: number): string;
  makeSurface(): Record<ThemeMode, Record<SemanticRole, string> & Record<SurfaceRung, string>>;
}
//#endregion
//#region src/colour/md3-tones.d.ts
declare const md3Tones: readonly [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100];
type Md3Tone = (typeof md3Tones)[number];
type Md3ToneArray = readonly string[];
declare const ti: (tone: Md3Tone) => number;
declare const scaleNumberMax: 0 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 95 | 99 | 100;
declare const minTone: 0;
declare const maxTone: 0 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 95 | 99 | 100;
declare const fallback: (array: Md3ToneArray, index: number) => string;
declare const getThemeTone: (range: Md3ToneArray, tone: Md3Tone) => string;
declare const md3AccentToneLight: Md3Tone;
declare const md3AccentToneDark: Md3Tone;
declare const md3AccentOnToneLight: Md3Tone;
declare const md3AccentOnToneDark: Md3Tone;
declare const md3ContainerToneLight: Md3Tone;
declare const md3ContainerToneDark: Md3Tone;
declare const md3OnContainerToneLight: Md3Tone;
declare const md3OnContainerToneDark: Md3Tone;
declare const md3ScrimHex = "#000000";
declare const md3ShadowHex = "#000000";
//#endregion
//#region src/colour/md3-scale-generator.d.ts
declare class Md3ScaleGenerator extends ColourScaleGenerator {
  static fromSeed(hex: string, backgroundY: number, minOffset?: number, maxOffset?: number): Md3ScaleGenerator;
  buildMd3Range: () => Md3ToneArray;
  colourAtScale: (scaleNumber: number) => string;
}
//#endregion
//#region src/colour/validation.d.ts
declare const seedLightnessMin = 0.35;
declare const seedLightnessMax = 0.65;
declare const seedChromaMin = 0.38;
declare const neutralChromaMax = 0.15;
declare const minSeedHueDelta = 5;
declare const minSurfaceLightnessDelta = 0.02;
declare const validateSeed: (name: string, hex: string, options?: {
  neutral?: boolean;
}) => void;
declare const validateHueDelta: (nameA: string, hexA: string, nameB: string, hexB: string, minDelta?: number) => void;
declare const validateTheme: (theme: Record<string, string | undefined>, label: string) => void;
//#endregion
//#region src/common.d.ts
declare const isObject: (value: unknown) => value is Record<PropertyKey, unknown>;
declare const isEmpty: (value: unknown) => boolean;
declare const isNullish: (value: unknown) => value is null | undefined;
declare const isNumeric: (value: unknown) => value is number;
declare const toFiniteNumber: (value: unknown) => number | undefined;
declare const clamp: (value: number | string, min: number | string, max: number | string) => number;
declare const clampUnsafe: (x: number, min: number, max: number) => number;
//#endregion
//#region src/date/constants.d.ts
declare const datetimeFormat = "YYYY-MM-DD HH:mm";
//#endregion
//#region src/date/convert.d.ts
declare const convertDEDateString: (date: string) => string;
declare const getRange: (dateRange: Date[]) => {
  begin: Dayjs;
  end: Dayjs;
};
declare const getLocalHour: (hour: number) => number;
declare const convertUTCStringToDate: (date: string) => Date;
declare const convertBerlinTimeToUTC: (date: string) => Date;
declare const convertDate: (date: string, fromFormat: string, toFormat: string, locale: string) => string | undefined;
//#endregion
//#region src/date/format.d.ts
declare const setDateLocale: (locale: string) => void;
declare const getFormattedDate: (date: string, locale?: string) => string;
declare const getFormattedDateShort: (date: number | string, locale?: string) => string;
declare const getFormattedShortDateFromUTC: (date: Date | string, locale?: string) => string;
declare const getFormattedDateShortSeconds: (date: number | string, locale?: string) => string;
declare const getDateDistance: (date: string, locale?: string) => string;
declare const getRelativeTime: (time: string) => string;
declare const formatDate: (time: string) => string;
declare const formatTime: (time: string) => string;
declare const formatLocalDate: (time: string) => string;
declare const formatLocalTime: (time: string) => string;
declare const formatFromToTime: (from: number, to: number) => string;
declare const formatTimeRange: (from: number, to: number) => string;
//#endregion
//#region src/date/test.d.ts
declare const isDateInRange: (date: Date, hours: number) => boolean;
declare const isFutureDate: (date: Date | string) => boolean;
declare const isPastDate: (time: string) => boolean;
declare const isBetweenTime: (time: string | undefined, begin: Dayjs, end: Dayjs) => boolean;
declare const closestDateIndex: (datesString: string[]) => number | undefined;
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
declare const addSpan: (suffix: string, isSvg: boolean) => string;
declare const beautifySuffix: (suffix: string, isSvg: boolean) => string;
declare const formatUnit: (u: string, isSvg?: boolean) => string;
declare const truncate: (string: string, n: number) => string;
//#endregion
//#region src/format/intl.d.ts
declare const formatWithIntl: (value: number, options: Intl.NumberFormatOptions, isSvg?: boolean) => string;
//#endregion
//#region src/format/number.d.ts
declare const formatFloat: (value: number, decimals?: number, options?: Intl.NumberFormatOptions, isSvg?: boolean) => string;
declare const formatSignFloat: (value: number, decimals?: number) => string;
declare const formatSiFloat: (value: number, isSvg?: boolean) => string;
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
declare const getOrdinal: (n: number, isSuperscript?: boolean, locale?: string) => string;
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
declare const isBetween: (value: number, a: number, b: number, isInclusive?: boolean) => boolean;
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
//#region src/temporal/common.d.ts
declare const isTimeBetween: (time: Temporal.PlainTime, start: Temporal.PlainTime, end: Temporal.PlainTime) => boolean;
declare const formatMs: (ms: number) => string;
//#endregion
//#region src/trading/nyse.d.ts
declare const isNyseTradingDay: (instant?: Temporal.Instant) => boolean;
declare const getNyseTradingDay: (instant?: Temporal.Instant) => string;
declare const isNysePreMarket: (instant?: Temporal.Instant) => boolean;
declare const isNyseExtendedTradingHours: (instant?: Temporal.Instant) => boolean;
declare const isEdgarOperating: (instant?: Temporal.Instant) => boolean;
declare const addNyseTradingDays: (tradingDay: string, tradingDaysToAdd: number) => string;
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
  password?: string;
  path?: string;
  port?: number | string;
  protocol: string;
  user?: string;
}, name?: string) => URL;
//#endregion
export { type ApcaTextRole, ColourScaleGenerator, type CurvePoint, MakeSurface, Md3ScaleGenerator, type Md3Tone, type Md3ToneArray, type SortArgument, addNyseTradingDays, addSpan, apcaMaxLcLargeFluentText, apcaMinLcByRole, apcaMinLcUiComponent, applyToeCurve, backgroundLightnessThreshold, beautifySuffix, blackHex, cCaretRight, cCircleWhite, cCombiningDiaeresis, cDashEm, cDashEn, cDashFigure, cDashNoBreak, cInfo, cMinus, cPlus, cPlusSmall, cSmallDot, cSpace, cSpaceFigure, cSpaceNarrowNoBreaking, cSpaceNoBreak, cSpacePunctuation, cSpaceThin, cSpaceZeroWidthBreaking, cSpaceZeroWidthNoBreak, capitalizeFirstLetter, chromaCurveFactor, chromaMaxOffset, chromaMinOffset, chromaMinOffsetForFloor, chunkify, cieExponent, cieMultiplierHigh, cieMultiplierLow, cieOffset, cieThreshold, clamp, clampUnsafe, closestDateIndex, convertBerlinTimeToUTC, convertDEDateString, convertDate, convertNameForEmail, convertUTCStringToDate, createUrl, datetimeFormat, delay, drawSvgCircle, drawSvgHLine, drawSvgLine, drawSvgRect, drawSvgRectWH, drawSvgVLine, fallback, formatDate, formatFloat, formatFloatFixed, formatFloatWithUnit, formatFromToTime, formatInt, formatLocalDate, formatLocalTime, formatMs, formatPP, formatPercent, formatReales, formatSiFloat, formatSiInt, formatSignFloat, formatSignInt, formatSignPercent, formatTime, formatTimeRange, formatUnit, formatWeight, formatWithIntl, getApcaContrast, getCardinalRules, getContrastColour, getContrastRatio, getCurveValue, getCurveValueClamped, getDateDistance, getDateFromTicks, getElementDimensions, getElementDimensionsPrecise, getElementHeight, getElementRect, getElementWidth, getFormattedDate, getFormattedDateShort, getFormattedDateShortSeconds, getFormattedShortDateFromUTC, getLocalHour, getLocale, getNyseTradingDay, getOrdinal, getRange, getRelativeTime, getThemeTone, getTicksFromDate, getTimeFromTicks, getTimestampFromTicks, hueDelta, hueShiftFactor, isBetween, isBetweenTime, isDateInRange, isEdgarOperating, isEmpty, isFutureDate, isMeetingApcaContrast, isNullish, isNumeric, isNyseExtendedTradingHours, isNysePreMarket, isNyseTradingDay, isObject, isPastDate, isTimeBetween, lightnessContrastExponentDark, lightnessContrastExponentLight, lightnessContrastOffset, lightnessMax, lightnessMin, loadFile, luminanceY, maxTone, md3AccentOnToneDark, md3AccentOnToneLight, md3AccentToneDark, md3AccentToneLight, md3ContainerToneDark, md3ContainerToneLight, md3OnContainerToneDark, md3OnContainerToneLight, md3ScrimHex, md3ShadowHex, md3Tones, minSeedHueDelta, minSurfaceLightnessDelta, minTone, nearestPow2, neutralChromaMax, nextPow2, okHslColour, onLocaleChange, optimisePath, pluralise, round, roundToThousands, scaleNumberMax, seedChromaMin, seedLightnessMax, seedLightnessMin, setDateLocale, setLocale, simpleNumberSort, simpleStringSort, sortBy, ti, toFiniteNumber, truncate, validateHueDelta, validateSeed, validateTheme, wcagTextMinRatio, wcagUiMinRatio, whiteHex, yToLightness };
//# sourceMappingURL=index.d.ts.map