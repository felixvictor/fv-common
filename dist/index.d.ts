import Color, { Coords } from "colorjs.io";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/de.js";
import "dayjs/locale/en.js";
import "dayjs/locale/en-gb.js";
//#region src/chunkify.d.ts
export declare const chunkify: <T>(array: T[], n: number, isBalanced?: boolean) => T[][];
//#endregion
//#region src/colour/colour-math.d.ts
export declare const backgroundLightnessThreshold: 0.18;
export declare const chromaCurveFactor: 4;
export declare const cieExponent: number;
export declare const cieMultiplierHigh: 1.16;
export declare const cieMultiplierLow: 9.032962962;
export declare const cieOffset: 0.16;
export declare const cieThreshold: 0.0088564516;
export declare const hueShiftFactor: 5;
export declare const lightnessContrastExponentLight: 2.2;
export declare const lightnessContrastExponentDark: 3.08;
export declare const lightnessContrastOffset: 0.05;
export declare const lightnessMin: 0;
export declare const lightnessMax: 1;
export declare const chromaMinOffset = 0.35;
export declare const chromaMaxOffset = 0.05;
export declare const applyToeCurve: (lightness: number) => number;
export declare const yToLightness: (y: number) => number;
export declare const luminanceY: (hex: string | undefined) => number | undefined;
export declare const hueDelta: (hex1: string, hex2: string) => number;
export declare const chromaMinOffsetForFloor: (hex: string, chromaFloor: number) => number;
//#endregion
//#region src/colour/okhsl-colour.d.ts
export declare class okHslColour {
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
export declare class ColourScaleGenerator {
  #private;
  constructor(maxScaleNumber: number, baseHue: number, minChroma: number, maxChroma: number, backgroundY: number);
  computeColour(scaleNumber: number): okHslColour;
}
//#endregion
//#region src/colour/constant.d.ts
export declare const blackHex = "#000";
export declare const whiteHex = "#fff";
//#endregion
//#region src/colour/contrast.d.ts
type ApcaTextRole = "bodyText" | "largeFluentText" | "otherContentText";
export declare const wcagTextMinRatio = 4.5;
export declare const wcagUiMinRatio = 3;
export declare const getContrastRatio: (hex1: string, hex2: string) => number;
export declare const getContrastColour: (colour: string, colourBlack?: string, colourWhite?: string) => string;
export declare const getApcaContrast: (textHex: string, backgroundHex: string) => number;
export declare const apcaMinLcByRole: Record<ApcaTextRole, number>;
export declare const apcaMaxLcLargeFluentText = 90;
export declare const apcaMinLcUiComponent = 30;
export declare const isMeetingApcaContrast: (textHex: string, backgroundHex: string, role?: ApcaTextRole) => boolean;
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
    readonly anchorLightness: 0.14;
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
export declare class MakeSurface {
  #private;
  constructor(baseHex: string);
  calculateSurface(lightness: number, chromaFactor: number): string;
  makeSurface(): Record<ThemeMode, Record<SemanticRole, string> & Record<SurfaceRung, string>>;
}
//#endregion
//#region src/colour/md3-tones.d.ts
export declare const md3Tones: readonly [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100];
type Md3Tone = (typeof md3Tones)[number];
type Md3ToneArray = readonly string[];
export declare const ti: (tone: Md3Tone) => number;
export declare const scaleNumberMax: 0 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 95 | 99 | 100;
export declare const minTone: 0;
export declare const maxTone: 0 | 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90 | 95 | 99 | 100;
export declare const fallback: (array: Md3ToneArray, index: number) => string;
export declare const getThemeTone: (range: Md3ToneArray, tone: Md3Tone) => string;
export declare const md3AccentToneLight: Md3Tone;
export declare const md3AccentToneDark: Md3Tone;
export declare const md3AccentOnToneLight: Md3Tone;
export declare const md3AccentOnToneDark: Md3Tone;
export declare const md3ContainerToneLight: Md3Tone;
export declare const md3ContainerToneDark: Md3Tone;
export declare const md3OnContainerToneLight: Md3Tone;
export declare const md3OnContainerToneDark: Md3Tone;
export declare const md3ScrimHex = "#000000";
export declare const md3ShadowHex = "#000000";
//#endregion
//#region src/colour/md3-scale-generator.d.ts
export declare class Md3ScaleGenerator extends ColourScaleGenerator {
  static fromSeed(hex: string, backgroundY: number, minOffset?: number, maxOffset?: number): Md3ScaleGenerator;
  buildMd3Range: () => Md3ToneArray;
  colourAtScale: (scaleNumber: number) => string;
}
//#endregion
//#region src/colour/validation.d.ts
export declare const seedLightnessMin = 0.35;
export declare const seedLightnessMax = 0.65;
export declare const seedChromaMin = 0.38;
export declare const neutralChromaMax = 0.15;
export declare const minSeedHueDelta = 5;
export declare const minSurfaceLightnessDelta = 0.02;
export declare const validateSeed: (name: string, hex: string, options?: {
  neutral?: boolean;
}) => void;
export declare const validateHueDelta: (nameA: string, hexA: string, nameB: string, hexB: string, minDelta?: number) => void;
export declare const validateTheme: (theme: Record<string, string | undefined>, label: string) => void;
//#endregion
//#region src/common.d.ts
export declare const isObject: (value: unknown) => value is Record<PropertyKey, unknown>;
export declare const isEmpty: (value: unknown) => boolean;
export declare const isNullish: (value: unknown) => value is null | undefined;
export declare const isNullishOrNaN: (value: unknown) => boolean;
export declare const isNumeric: (value: unknown) => value is number;
export declare const toFiniteNumber: (value: unknown) => number | undefined;
export declare const clamp: (value: number | string, min: number | string, max: number | string) => number;
export declare const clampUnsafe: (x: number, min: number, max: number) => number;
export declare const lerp: (value1: number | string, value2: number | string, t: number | string) => number;
export declare const lerpUnsafe: (v1: number, v2: number, t: number) => number;
//#endregion
//#region src/date/constants.d.ts
export declare const datetimeFormat = "YYYY-MM-DD HH:mm";
//#endregion
//#region src/date/convert.d.ts
export declare const convertDEDateString: (date: string) => string;
export declare const getRange: (dateRange: Date[]) => {
  begin: Dayjs;
  end: Dayjs;
};
export declare const getLocalHour: (hour: number) => number;
export declare const convertUTCStringToDate: (date: string) => Date;
export declare const convertBerlinTimeToUTC: (date: string) => Date;
export declare const convertDate: (date: string, fromFormat: string, toFormat: string, locale: string) => string | undefined;
//#endregion
//#region src/date/format.d.ts
export declare const setDateLocale: (locale: string) => void;
export declare const getFormattedDate: (date: string, locale?: string) => string;
export declare const getFormattedDateShort: (date: number | string, locale?: string) => string;
export declare const getFormattedShortDateFromUTC: (date: Date | string, locale?: string) => string;
export declare const getFormattedDateShortSeconds: (date: number | string, locale?: string) => string;
export declare const getDateDistance: (date: string, locale?: string) => string;
export declare const getRelativeTime: (time: string) => string;
export declare const formatDateViaDayjs: (time: string) => string;
export declare const formatTime: (time: string) => string;
export declare const formatLocalDate: (time: string) => string;
export declare const formatLocalTime: (time: string) => string;
export declare const formatFromToTime: (from: number, to: number) => string;
export declare const formatTimeRange: (from: number, to: number) => string;
//#endregion
//#region src/date/test.d.ts
export declare const isDateInRange: (date: Date, hours: number) => boolean;
export declare const isFutureDate: (date: Date | string) => boolean;
export declare const isPastDate: (time: string) => boolean;
export declare const isBetweenTime: (time: string | undefined, begin: Dayjs, end: Dayjs) => boolean;
export declare const closestDateIndex: (datesString: string[]) => number | undefined;
//#endregion
//#region src/date/ticks.d.ts
export declare const getTimeFromTicks: (ticks: bigint | number | string) => string;
export declare const getDateFromTicks: (ticks: bigint | number) => dayjs.Dayjs;
export declare const getTicksFromDate: (date: dayjs.Dayjs | number) => bigint;
export declare const getTimestampFromTicks: (ticks: bigint | number | string) => number;
//#endregion
//#region src/delay.d.ts
export declare const delay: (ms: number) => Promise<unknown>;
//#endregion
//#region src/fetch.d.ts
export declare const loadFile: <T = unknown>(path: string) => Promise<T>;
//#endregion
//#region src/format/cardinal.d.ts
export declare const getCardinalRules: (locale: string) => Intl.PluralRules;
//#endregion
//#region src/format/email.d.ts
export declare const convertNameForEmail: (name: string) => string;
//#endregion
//#region src/format/helpers.d.ts
export declare const addSpan: (suffix: string, isSvg: boolean) => string;
export declare const beautifySuffix: (suffix: string, isSvg: boolean) => string;
export declare const formatUnit: (u: string, isSvg?: boolean) => string;
export declare const truncate: (string: string, n: number) => string;
//#endregion
//#region src/format/intl.d.ts
export declare const formatWithIntl: (value: number, options: Intl.NumberFormatOptions, isSvg?: boolean) => string;
//#endregion
//#region src/format/number.d.ts
export declare const formatFloat: (value: number, decimals?: number, options?: Intl.NumberFormatOptions, isSvg?: boolean) => string;
export declare const formatSignFloat: (value: number, decimals?: number) => string;
export declare const formatSiFloat: (value: number, isSvg?: boolean) => string;
export declare const formatFloatFixed: (value: number, decimals?: number) => string;
export declare const formatFloatWithUnit: (x: number, u: string) => string;
export declare const formatReales: (x: number) => string;
export declare const formatWeight: (x: number) => string;
export declare const round: (n: number, d?: number) => number;
export declare const roundToThousands: (value: number) => number;
export declare const formatInt: (value: number, options?: Intl.NumberFormatOptions) => string;
export declare const formatSignInt: (value: number) => string;
export declare const formatSiInt: (x: number, max?: number, options?: Intl.NumberFormatOptions) => string;
//#endregion
//#region src/format/ordinal.d.ts
export declare const getOrdinal: (n: number, isSuperscript?: boolean, locale?: string) => string;
//#endregion
//#region src/format/percent.d.ts
export declare const formatPercent: (value: number, decimals?: number, options?: Intl.NumberFormatOptions) => string;
export declare const formatSignPercent: (value: number, decimals?: number) => string;
export declare const formatPP: (x: number, f?: number) => string;
//#endregion
//#region src/format/text.d.ts
export declare const capitalizeFirstLetter: (text: string, locale?: string) => string;
export declare const pluralise: (count: number, wordSingle: string, wordPlural?: string) => string;
//#endregion
//#region src/html.d.ts
export declare const getElementRect: (element: HTMLElement | SVGElement) => {
  bottom: number;
  height: number;
  left: number;
  right: number;
  top: number;
  width: number;
  x: number;
  y: number;
};
export declare const getElementHeight: (element: HTMLElement | SVGElement) => number;
export declare const getElementWidth: (element: HTMLElement | SVGElement) => number;
export declare const getElementDimensions: (element: HTMLElement | SVGElement) => {
  height: number;
  width: number;
};
export declare const getElementDimensionsPrecise: (element: HTMLElement | SVGElement) => {
  height: number;
  width: number;
};
//#endregion
//#region src/locale.d.ts
export declare const setLocale: (locale: string) => void;
export declare const getLocale: () => string;
export declare const onLocaleChange: (callback: () => void) => void;
//#endregion
//#region src/math/common.d.ts
export declare const isBetween: (value: number, a: number, b: number, isInclusive?: boolean) => boolean;
//#endregion
//#region src/math/find-segment.d.ts
interface CurvePoint {
  tangentIn: number;
  tangentOut: number;
  time: number;
  value: number;
}
export declare const getCurveValue: (time: number, points: CurvePoint[]) => number | undefined;
export declare const getCurveValueClamped: (time: number, points: CurvePoint[]) => number;
//#endregion
//#region src/math/power.d.ts
export declare const nearestPow2: (value: number) => number;
export declare const nextPow2: (value: number) => number;
//#endregion
//#region src/result.d.ts
interface Err<E> {
  readonly error: E;
  readonly ok: false;
}
interface Ok<T> {
  readonly ok: true;
  readonly value: T;
}
type Result<T, E> = Err<E> | Ok<T>;
export declare function andThen<T, U, E>(result: Result<T, E>, next: (value: T) => Result<U, E>): Result<U, E>;
export declare function err<E>(error: E): Err<E>;
export declare function isErr<T, E>(result: Result<T, E>): result is Err<E>;
export declare function isOk<T, E>(result: Result<T, E>): result is Ok<T>;
export declare function ok<T>(value: T): Ok<T>;
export declare function unwrapOr<T, E>(result: Result<T, E>, fallback: T): T;
export declare function unwrapOrThrow<T, E>(result: Result<T, E>, message: string): T;
//#endregion
//#region src/sort.d.ts
type SortArgument<T> = `-${keyof T & string}` | keyof T;
export declare const sortBy: <T extends object>(sortArguments: SortArgument<T>[]) => (a: T, b: T) => number;
export declare function simpleNumberSort(a: number, b: number): number;
export declare function simpleNumberSort(a: null | number | undefined, b: null | number | undefined): number;
export declare function simpleStringSort(a: string, b: string): number;
export declare function simpleStringSort(a: null | string | undefined, b: null | string | undefined): number;
//#endregion
//#region src/svg/draw.d.ts
export declare const drawSvgCircle: (x: number, y: number, r: number) => string;
export declare const drawSvgRect: (x: number, y: number, size: number) => string;
export declare const drawSvgRectWH: (x: number, y: number, width: number, height: number) => string;
export declare const drawSvgVLine: (x: number, y: number, length: number) => string;
export declare const drawSvgHLine: (x: number, y: number, length: number) => string;
export declare const drawSvgLine: (x1: number, y1: number, x2: number, y2: number) => string;
//#endregion
//#region src/svg/optimise.d.ts
export declare const optimisePath: (path: string) => string;
//#endregion
//#region src/temporal/compare.d.ts
export declare const isTimeBetween: (time: Temporal.PlainTime, start: Temporal.PlainTime, end: Temporal.PlainTime) => boolean;
export declare const isInstantAfter: (instant1: Temporal.Instant, instant2: Temporal.Instant) => boolean;
export declare const isInstantAtOrAfter: (instant1: Temporal.Instant, instant2: Temporal.Instant) => boolean;
export declare const isInstantAtOrBefore: (instant1: Temporal.Instant, instant2: Temporal.Instant) => boolean;
export declare const isInstantBefore: (instant1: Temporal.Instant, instant2: Temporal.Instant) => boolean;
//#endregion
//#region src/temporal/convert.d.ts
export declare const dateToString: (date: Date) => string;
//#endregion
//#region src/temporal/format.d.ts
export declare const formatMs: (ms: number, options?: Intl.DurationFormatOptions, locale?: string) => string;
export declare const formatPlainTime: (time: Temporal.PlainTime, options?: Intl.DateTimeFormatOptions, locale?: string) => string;
export declare const formatDate: (date: Date, options?: Intl.DateTimeFormatOptions, locale?: string) => string;
export declare const formatDateString: (dateString: string, options?: Intl.DateTimeFormatOptions, locale?: string) => string;
export declare const formatDuration: (duration: Temporal.Duration, options?: Intl.DurationFormatOptions, locale?: string) => string;
export declare const formatInstant: (instant: Temporal.Instant, options?: Intl.DateTimeFormatOptions, locale?: string) => string;
//#endregion
//#region src/temporal/manipulate.d.ts
export declare const addToInstant: (instant: Temporal.Instant, duration: Temporal.DurationLike) => Temporal.Instant;
export declare const subtractFromInstant: (instant: Temporal.Instant, duration: Temporal.DurationLike) => Temporal.Instant;
//#endregion
//#region src/temporal/query.d.ts
export declare const daysBetweenInstants: (start: Temporal.Instant, end: Temporal.Instant) => number;
export declare const getMidnightUTC: (dateString: string) => Temporal.ZonedDateTime;
export declare const hoursBetweenInstants: (start: Temporal.Instant, end: Temporal.Instant) => number;
//#endregion
//#region src/unicode.d.ts
export declare const cCaretRight: string;
export declare const cCircleWhite: string;
export declare const cCombiningDiaeresis: string;
export declare const cDashEm: string;
export declare const cDashEn: string;
export declare const cDashFigure: string;
export declare const cDashNoBreak: string;
export declare const cInfo: string;
export declare const cMinus: string;
export declare const cPlus: string;
export declare const cPlusSmall: string;
export declare const cSmallDot: string;
export declare const cSpace: string;
export declare const cSpaceFigure: string;
export declare const cSpaceNarrowNoBreaking: string;
export declare const cSpaceNoBreak: string;
export declare const cSpacePunctuation: string;
export declare const cSpaceThin: string;
export declare const cSpaceZeroWidthBreaking: string;
export declare const cSpaceZeroWidthNoBreak: string;
//#endregion
//#region src/url.d.ts
export declare const createUrl: (options: {
  host: string;
  password?: string;
  path?: string;
  port?: number | string;
  protocol?: string;
  user?: string;
}, name?: string) => URL;
//#endregion
export type { ApcaTextRole, CurvePoint, Err, Md3Tone, Md3ToneArray, Ok, Result, SortArgument };
//# sourceMappingURL=index.d.ts.map