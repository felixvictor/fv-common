import Color from "colorjs.io";
import dayjs from "dayjs";
import "dayjs/locale/de";
import "dayjs/locale/en";
import relativeTime from "dayjs/plugin/relativeTime.js";
import SVGPathCommander from "svg-path-commander";

//#region src/common.ts
const clamp = (x, min, max) => {
	let lower = Number(min);
	let upper = Number(max);
	const value = Number(x);
	if (Number.isNaN(value) || Number.isNaN(lower) || Number.isNaN(upper)) return NaN;
	if (lower > upper) [lower, upper] = [upper, lower];
	return Math.min(Math.max(value, lower), upper);
};

//#endregion
//#region src/colour/colour-math.ts
var ColourMath = class ColourMath {
	static backgroundLightnessThreshold = .18;
	static chromaCurveFactor = 4;
	static cieExponent = 1 / 3;
	static cieMultiplierHigh = 116;
	static cieMultiplierLow = 903.2962962;
	static cieOffset = 16;
	static cieThreshold = .0088564516;
	static hueShiftFactor = 5;
	static lightnessContrastExponent = 3.04;
	static lightnessContrastOffset = .05;
	static lightnessMax = 1;
	static lightnessMin = 0;
	static lightnessScaleFactor = 100;
	static toeK1 = .206;
	static toeK2 = .03;
	static toeK3 = (1 + ColourMath.toeK1) / (1 + ColourMath.toeK2);
	static applyToeCurve(lightness) {
		const term = ColourMath.toeK3 * lightness - ColourMath.toeK1;
		return .5 * (term + Math.sqrt(term * term + 4 * ColourMath.toeK2 * ColourMath.toeK3 * lightness));
	}
	static yToLightness(y) {
		return y <= ColourMath.cieThreshold ? y * ColourMath.cieMultiplierLow : ColourMath.cieMultiplierHigh * Math.pow(y, ColourMath.cieExponent) - ColourMath.cieOffset;
	}
};

//#endregion
//#region src/colour/hsl-colour.ts
var HslColour = class HslColour {
	static colorSpace = "okhsl";
	static hexFormat = "hex";
	static hueMax = 360;
	static hueMin = 0;
	static lightnessMax = 100;
	static lightnessMin = 0;
	static outputColorSpace = "srgb";
	static saturationMax = 100;
	static saturationMin = 0;
	get colourObject() {
		return this.#colour;
	}
	get h() {
		return this.#colour.h ?? HslColour.hueMin;
	}
	set h(value) {
		const h = Number(value);
		if (Number.isNaN(h)) {
			console.warn(`${HslColour.name}: Cannot set hue to invalid value "${value}" (${h}), keeping current value "${this.#colour.h}"`);
			return;
		}
		this.#colour.h = (h % HslColour.hueMax + HslColour.hueMax) % HslColour.hueMax;
	}
	get hex() {
		return this.#colour.to(HslColour.outputColorSpace).toString({ format: HslColour.hexFormat });
	}
	get l() {
		return this.#colour.l ?? HslColour.lightnessMin;
	}
	set l(value) {
		const l = Number(value);
		if (Number.isNaN(l)) {
			console.warn(`${HslColour.name}: Cannot set lightness to invalid value "${value}" (${l}), keeping current value "${this.#colour.l}"`);
			return;
		}
		this.#colour.l = clamp(l, HslColour.lightnessMin, HslColour.lightnessMax);
	}
	get s() {
		return this.#colour.s ?? HslColour.saturationMin;
	}
	set s(value) {
		const s = Number(value);
		if (Number.isNaN(s)) {
			console.warn(`${HslColour.name}: Cannot set saturation to invalid value "${value}" (${s}), keeping current value "${this.#colour.s}"`);
			return;
		}
		this.#colour.s = clamp(s, HslColour.saturationMin, HslColour.saturationMax);
	}
	#colour;
	constructor(argument) {
		if (typeof argument === "string") this.#colour = new Color(argument).to(HslColour.colorSpace);
		else if (argument instanceof Color) this.#colour = new Color(argument).to(HslColour.colorSpace);
		else this.#colour = new Color({
			coords: argument,
			space: HslColour.colorSpace
		});
	}
	static mix(color1, color2, weight) {
		return new HslColour(Color.mix(color1.colourObject, color2.colourObject, weight, {
			outputSpace: HslColour.colorSpace,
			space: HslColour.colorSpace
		}));
	}
	clone() {
		return new HslColour(this.#colour);
	}
	toString() {
		return this.hex;
	}
};

//#endregion
//#region src/colour/colour-at-scale.ts
/**
* {@link https://matthewstrom.com/writing/generating-color-palettes/}
*
* Utility class for perceptually-designed HSL color scale generation.
* Based on Matthew Ström's color palette generation algorithm.
*/
var ColourScaleGenerator = class {
	#backgroundY;
	#baseHue;
	#maxChroma;
	#maxScaleNumber;
	#minChroma;
	constructor(maxScaleNumber, baseHue, minChroma, maxChroma, backgroundY) {
		this.#maxScaleNumber = maxScaleNumber;
		this.#baseHue = baseHue;
		this.#minChroma = minChroma;
		this.#maxChroma = maxChroma;
		this.#backgroundY = backgroundY;
	}
	computeColour(scaleNumber) {
		const scaleValue = this.#normalizeScaleNumber(scaleNumber);
		const normalizedLightness = clamp(this.#computeScaleLightness(scaleValue) / ColourMath.lightnessScaleFactor, ColourMath.lightnessMin, ColourMath.lightnessMax);
		return new HslColour([
			this.#computeScaleHue(scaleValue),
			this.#computeScaleChroma(scaleValue),
			normalizedLightness
		]);
	}
	#computeScaleChroma(scaleValue) {
		const chromaDifference = this.#maxChroma - this.#minChroma;
		const parabolaFactor = -ColourMath.chromaCurveFactor * chromaDifference;
		const linearFactor = ColourMath.chromaCurveFactor * chromaDifference;
		return parabolaFactor * Math.pow(scaleValue, 2) + linearFactor * scaleValue + this.#minChroma;
	}
	#computeScaleHue(scaleValue) {
		return this.#baseHue + ColourMath.hueShiftFactor * (1 - scaleValue);
	}
	#computeScaleLightness(scaleValue) {
		const exponentialTerm = Math.exp(ColourMath.lightnessContrastExponent * scaleValue);
		const adjustedBackground = this.#backgroundY + ColourMath.lightnessContrastOffset;
		const foregroundY = this.#backgroundY > ColourMath.backgroundLightnessThreshold ? adjustedBackground / exponentialTerm - ColourMath.lightnessContrastOffset : exponentialTerm * adjustedBackground - ColourMath.lightnessContrastOffset;
		return ColourMath.applyToeCurve(ColourMath.yToLightness(foregroundY));
	}
	#normalizeScaleNumber(scaleNumber) {
		return scaleNumber / this.#maxScaleNumber;
	}
};

//#endregion
//#region src/colour/colour-utility.ts
var ColourUtility = class ColourUtility {
	static defaultBaseTint = 40;
	static defaultHarmonizationMix = 80;
	static fallbackHue = 0;
	static fallbackLightness = 0;
	static fallbackSaturation = 1;
	static maxSaturation = .25;
	static maxSaturationNeutral = .2;
	static maxTone = 100;
	static minSaturation = 0;
	static neutralHarmonizationMix = 0;
	static onDarkBase = "#fff";
	static onDarkMixAmount = 5;
	static onLightBase = "#000";
	static onLightMixAmount = 40;
	static percentageScale = 100;
	get baseTint() {
		return this.#baseTint;
	}
	get onDark() {
		return this.#onDark;
	}
	get onLight() {
		return this.#onLight;
	}
	#baseColour;
	#baseTint;
	#onDark;
	#onLight;
	constructor(baseColourHex, baseTint = ColourUtility.defaultBaseTint) {
		this.#baseColour = new HslColour(baseColourHex);
		this.#baseTint = baseTint;
		this.#onDark = this.colourMixin(new HslColour(ColourUtility.onDarkBase), ColourUtility.onDarkMixAmount);
		this.#onLight = this.colourMixin(new HslColour(ColourUtility.onLightBase), ColourUtility.onLightMixAmount);
	}
	colourMixin(mixColour, mixAmount = ColourUtility.defaultHarmonizationMix) {
		const targetColour = typeof mixColour === "string" ? new HslColour(mixColour) : mixColour;
		const harmonizedBase = new HslColour([
			targetColour.h,
			this.#baseColour.s,
			this.#baseColour.l
		]);
		return this.mixColours(harmonizedBase, targetColour, ColourUtility.percentageScale - mixAmount);
	}
	getBaseTintedColour(colourHex) {
		return this.getTint(new HslColour(colourHex), this.#baseTint);
	}
	getColourAtTint(tone, colour, background, neutral = false) {
		const invertedTone = ColourUtility.maxTone - tone;
		const hue = colour.h;
		const saturation = colour.s;
		const maxSaturation = neutral ? ColourUtility.maxSaturationNeutral : Math.max(ColourUtility.maxSaturation, saturation);
		const invertedBackgroundLightness = 1 - background.l;
		return new ColourScaleGenerator(ColourUtility.maxTone, hue, ColourUtility.minSaturation, maxSaturation, invertedBackgroundLightness).computeColour(invertedTone);
	}
	getHarmonisedColour(colourHex, mixAmount) {
		const harmonized = this.colourMixin(new HslColour(colourHex), mixAmount);
		return this.getTint(harmonized, this.#baseTint);
	}
	getHarmonisedColourNeutral(colourHex) {
		const harmonized = this.colourMixin(new HslColour(colourHex), ColourUtility.neutralHarmonizationMix);
		return this.getTint(harmonized, this.#baseTint, this.#onLight, true);
	}
	getTint(colour, tone, backgroundColour = this.#onLight, neutral = false) {
		return this.getColourAtTint(tone, colour, backgroundColour, neutral);
	}
	mixColours(color1, color2, weightPercentage = this.#baseTint) {
		const weightScale = weightPercentage / ColourUtility.percentageScale;
		return HslColour.mix(color1, color2, weightScale);
	}
};

//#endregion
//#region src/date.ts
dayjs.extend(relativeTime);
let currentLocale = "de";
/**
* Sets the active locale for date formatting.
* @param locale - ISO locale code ('de' or 'en')
*/
const setLocale = (locale) => {
	currentLocale = locale;
	dayjs.locale(locale);
};
/**
* Gets the current active locale.
*/
const getLocale = () => currentLocale;
setLocale("de");
/**
* Formats date with locale-specific formatting.
* @example getFormattedDate('2024-01-15') → "Montag, 15. Januar, 14.30" (de)
*/
const getFormattedDate = (date) => {
	return dayjs(date).format("dddd, D. MMMM, H.mm");
};
/**
* Short date format with day, month, and time.
* @example getFormattedDateShort('2024-01-15') → "15.1. 14.30"
*/
const getFormattedDateShort = (date) => {
	return dayjs(date).format("D.M. H.mm");
};
/**
* Date format with seconds included.
* @example getFormattedDateShortSeconds('2024-01-15') → "15. Januar 14.30.45"
*/
const getFormattedDateShortSeconds = (date) => {
	return dayjs(date).format("D. MMMM H.mm.ss");
};
/**
* Returns relative time string (e.g., "vor 2 Stunden" or "2 hours ago").
* Uses currently active locale.
*/
const getDateDistance = (date) => {
	return dayjs(date).fromNow();
};
/**
* Checks if the given date is in the future.
*/
const isFutureDate = (date) => {
	return dayjs().isBefore(date);
};
/**
* Finds the index of the date closest to now.
* @returns Index of closest date, or undefined if array is empty
*/
const closestDateIndex = (datesString) => {
	if (datesString.length === 0) return void 0;
	const now = dayjs();
	const dateDiffs = datesString.map((date) => Math.abs(now.diff(date)));
	return dateDiffs.indexOf(Math.min(...dateDiffs));
};

//#endregion
//#region src/delay.ts
const delay = async (ms) => await new Promise((resolve) => setTimeout(resolve, ms));

//#endregion
//#region src/unicode.ts
const cDashEm = String.fromCodePoint(8212);
const cDashEn = String.fromCodePoint(8211);
const cDashFigure = String.fromCodePoint(8210);
const cMinus = String.fromCodePoint(8722);
const cPlus = String.fromCodePoint(43);
const cPlusSmall = String.fromCodePoint(65122);
const cSpaceFigure = String.fromCodePoint(8199);
const cSpaceNarrowNoBreaking = String.fromCodePoint(8239);
const cSpaceNoBreak = String.fromCodePoint(160);
const cSpacePunctuation = String.fromCodePoint(8200);
const cSpaceThin = String.fromCodePoint(8201);
const cSpaceZeroWidthBreaking = String.fromCodePoint(65279);
const cCombiningDiaeresis = String.fromCodePoint(776);

//#endregion
//#region src/format/intl-helpers.ts
/**
* Adds styled span/tspan wrapper for compact notation suffixes.
*/
const addSpan = (suffix, svg) => svg ? `<tspan class="caps">${suffix}</tspan>` : `<span class="caps">${suffix}</span>`;
/**
* Beautifies compact notation suffixes (K, M) with styling and spacing.
*/
const beautifySuffix = (suffix, svg) => cSpaceThin + suffix.replace("K", addSpan("k", svg)).replace("M", addSpan("m", svg));
/**
* Internal number formatter using Intl.NumberFormat with custom typographic enhancements.
* Applies thin spaces, proper minus signs, and styled compact notation.
*/
const formatWithIntl = (value, options, svg = false) => {
	return new Intl.NumberFormat("de", options).formatToParts(value).map((part) => {
		switch (part.type) {
			case "compact": return beautifySuffix(part.value, svg);
			case "currency": return part.value;
			case "decimal": return part.value;
			case "fraction": return part.value;
			case "group": return cSpaceThin;
			case "integer": return part.value;
			case "literal": return part.value;
			case "minusSign": return `${cMinus}${cSpaceNarrowNoBreaking}`;
			case "percentSign": return `${cSpaceNarrowNoBreaking}%`;
			case "plusSign": return `${cPlus}${cSpaceNarrowNoBreaking}`;
			case "unit": return part.value;
		}
		return part.value;
	}).join("");
};

//#endregion
//#region src/format/number.ts
/**
* Base number formatter with decimal precision.
*/
const formatNumber = (value, decimals = 2, options = {}, svg = false) => {
	return formatWithIntl(value, {
		maximumFractionDigits: decimals,
		...options,
		style: "decimal"
	}, svg);
};
/**
* Formats a floating-point number with specified decimal places.
* @example formatFloat(1234.5678, 2) → "1 234.57"
*/
const formatFloat = (value, decimals = 2, options = {}, svg = false) => formatNumber(value, decimals, options, svg);
/**
* Formats a float with explicit sign (+/-).
* @example formatSignFloat(42.5, 2) → "+42.50"
* @example formatSignFloat(-42.5, 2) → "−42.50"
*/
const formatSignFloat = (value, decimals = 2) => {
	return formatFloat(value, decimals, { signDisplay: "always" });
};
/**
* Formats a number with SI compact notation (K, M suffixes).
* @example formatSiFloat(1234567) → "1.2 m" (where m is styled)
*/
const formatSiFloat = (value, svg = false) => {
	return formatFloat(value, 2, {
		maximumSignificantDigits: 2,
		notation: "compact"
	}, svg);
};
/**
* Formats a float with fixed decimal places, using figure spaces for missing digits.
* Ensures alignment in tabular data by replacing trailing zeros with figure spaces.
* @example formatFloatFixed(42, 2) → "42  " (with figure spaces)
* @example formatFloatFixed(42.1, 2) → "42.1 " (with one figure space)
*/
const formatFloatFixed = (value, decimals = 2) => {
	return formatFloat(value, decimals, { minimumFractionDigits: decimals }).replace(/\.00$/, cSpacePunctuation + cSpaceFigure + cSpaceFigure).replace(/\.0$/, cSpacePunctuation + cSpaceFigure).replaceAll(/\.(\d)0$/g, `.$1${cSpaceFigure}`);
};
/**
* Rounds a number to specified decimal places.
* @example round(3.14159, 2) → 3.14
*/
const round = (value, decimals = 0) => {
	return Number(formatFloat(value, decimals));
};
/**
* Rounds a number to 3 decimal places (thousands precision).
* @example roundToThousands(3.14159) → 3.142
*/
const roundToThousands = (value) => round(value, 3);
/**
* Formats an integer (no decimal places).
* @example formatInt(1234567) → "1 234 567"
*/
const formatInt = (value, options = {}) => {
	return formatNumber(value, 0, options);
};
/**
* Formats an integer with explicit sign (+/-).
* @example formatSignInt(42) → "+42"
*/
const formatSignInt = (value) => {
	return formatInt(value, { signDisplay: "always" });
};

//#endregion
//#region src/format/percent.ts
/**
* Formats a decimal value as a percentage.
* @param value - Decimal value (e.g., 0.42 for 42%)
* @param decimals - Number of decimal places
* @example formatPercent(0.4567, 1) → "45.7 %"
*/
const formatPercent = (value, decimals = 1, options = {}) => {
	return formatWithIntl(value, {
		maximumFractionDigits: decimals,
		...options,
		style: "percent"
	});
};
/**
* Formats a percentage with explicit sign (+/-).
* @example formatSignPercent(0.42, 1) → "+42.0 %"
*/
const formatSignPercent = (value, decimals = 1) => {
	return formatPercent(value, decimals, { signDisplay: "always" });
};

//#endregion
//#region src/format/text.ts
/**
* Capitalizes the first letter of a string.
* @link https://stackoverflow.com/a/1026087
* @example capitalizeFirstLetter("hello") → "Hello"
*/
const capitalizeFirstLetter = (text) => {
	return text.charAt(0).toUpperCase() + text.slice(1);
};
const cardinalRules = new Intl.PluralRules("en", { type: "cardinal" });
/**
* Returns the appropriate singular or plural form based on count.
* Uses Intl.PluralRules for locale-aware pluralization.
* @example pluralise(1, "item", "items") → "item"
* @example pluralise(5, "item", "items") → "items"
*/
const pluralise = (count, wordSingle, wordPlural) => {
	return cardinalRules.select(count) === "one" ? wordSingle : wordPlural;
};

//#endregion
//#region src/html.ts
const getElementWidth = (element) => {
	const { width } = element.getBoundingClientRect();
	return Math.floor(width);
};

//#endregion
//#region src/sort.ts
/**
* Parses a SortArgument string to extract the property key and sort direction.
*/
const parseSortArgument = (property) => {
	const propertyString = String(property);
	const desc = propertyString.startsWith("-");
	return {
		desc,
		key: desc ? propertyString.slice(1) : propertyString
	};
};
/**
* Locale-aware string comparison with numeric sorting.
* Note: 'base' sensitivity ignores case and accents, which is often desirable for data sorting.
*/
const compareStrings = (a, b) => a.localeCompare(b, void 0, {
	numeric: true,
	sensitivity: "base"
});
/**
* Check if a value is nullish (null or undefined).
*/
const isNullish = (value) => value == void 0;
/**
* Compare two values with nullish handling.
* Returns 0 if both are nullish, 1 if only a is nullish, -1 if only b is nullish, undefined otherwise.
*/
const compareNullish = (a, b) => {
	const aIsNullish = isNullish(a);
	const bIsNullish = isNullish(b);
	if (aIsNullish && bIsNullish) return 0;
	if (aIsNullish) return 1;
	if (bIsNullish) return -1;
};
/**
* Compare two values with explicit null/undefined handling and type coercion.
* - null/undefined are treated as equal to each other, but greater than all non-null/undefined values (pushing them to the end).
* - Tries numeric comparison first if both are numbers/convertible to numbers.
* - Falls back to string comparison using localeCompare.
*/
const compareValues = (a, b) => {
	if (a === b) return 0;
	const nullishResult = compareNullish(a, b);
	if (nullishResult !== void 0) return nullishResult;
	const numberA = Number(a);
	const numberB = Number(b);
	if (Number.isFinite(numberA) && Number.isFinite(numberB)) return numberA - numberB;
	if (typeof a === "string" && typeof b === "string") return compareStrings(a, b);
	return 0;
};
/**
* Sort by a list of properties (in left-to-right order)
* Properties prefixed with '-' are sorted in descending order
* @example sortBy(['name', '-age']) // Sort by name ascending, then age descending
*/
const sortBy = (propertyNames) => (a, b) => {
	for (const property of propertyNames) {
		const { desc, key } = parseSortArgument(property);
		const result = compareValues(a[key], b[key]);
		if (result !== 0) return desc ? -result : result;
	}
	return 0;
};
function simpleNumberSort(a, b) {
	const nullishResult = compareNullish(a, b);
	if (nullishResult !== void 0) return nullishResult;
	return a - b;
}
function simpleStringSort(a, b) {
	const nullishResult = compareNullish(a, b);
	if (nullishResult !== void 0) return nullishResult;
	return compareStrings(a, b);
}

//#endregion
//#region src/svg/draw.ts
const drawSvgRect = (x, y, h, w) => `M${x},${y}h${w}v${h}h${-w}`;
const drawSvgLine = (x1, y1, x2, y2) => `M${x1},${y1}L${x2},${y2}`;
const drawSvgVLine = (x, y, l) => `M${x},${y}v${l}`;
const drawSvgHLine = (x, y, l) => `M${x},${y}h${l}`;

//#endregion
//#region src/svg/optimise.ts
const optimisePath = (path) => new SVGPathCommander(path, { round: 2 }).optimize().toString();

//#endregion
export { ColourMath, ColourScaleGenerator, ColourUtility, HslColour, cCombiningDiaeresis, cDashEm, cDashEn, cDashFigure, cMinus, cPlus, cPlusSmall, cSpaceFigure, cSpaceNarrowNoBreaking, cSpaceNoBreak, cSpacePunctuation, cSpaceThin, cSpaceZeroWidthBreaking, capitalizeFirstLetter, clamp, closestDateIndex, delay, drawSvgHLine, drawSvgLine, drawSvgRect, drawSvgVLine, formatFloat, formatFloatFixed, formatInt, formatPercent, formatSiFloat, formatSignFloat, formatSignInt, formatSignPercent, formatWithIntl, getDateDistance, getElementWidth, getFormattedDate, getFormattedDateShort, getFormattedDateShortSeconds, getLocale, isFutureDate, optimisePath, pluralise, round, roundToThousands, setLocale, simpleNumberSort, simpleStringSort, sortBy };
//# sourceMappingURL=index.js.map