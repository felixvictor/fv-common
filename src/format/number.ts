import { cSpaceFigure, cSpaceNarrowNoBreaking, cSpacePunctuation } from "../unicode.js"
import { formatUnit } from "./helpers.js"
import { formatWithIntl } from "./intl.js"

/**
 * Base number formatter with decimal precision.
 */
const formatNumber = (value: number, decimals = 2, options: Intl.NumberFormatOptions = {}, svg = false): string => {
    return formatWithIntl(value, { maximumFractionDigits: decimals, ...options, style: "decimal" }, svg)
}

/**
 * Formats a floating-point number with specified decimal places.
 * @example formatFloat(1234.5678, 2) → "1 234.57"
 */
export const formatFloat = (value: number, decimals = 2, options: Intl.NumberFormatOptions = {}, svg = false): string =>
    formatNumber(value, decimals, options, svg)

/**
 * Formats a float with explicit sign (+/-).
 * @example formatSignFloat(42.5, 2) → "+42.50"
 * @example formatSignFloat(-42.5, 2) → "−42.50"
 */
export const formatSignFloat = (value: number, decimals = 2): string => {
    return formatFloat(value, decimals, { signDisplay: "always" })
}

/**
 * Formats a number with SI compact notation (K, M suffixes).
 * @example formatSiFloat(1234567) → "1.2 m" (where m is styled)
 */
export const formatSiFloat = (value: number, svg = false): string => {
    return formatFloat(
        value,
        2,
        {
            maximumSignificantDigits: 2,
            notation: "compact",
        },
        svg,
    )
}

/**
 * Formats a float with fixed decimal places, using figure spaces for missing digits.
 * Ensures alignment in tabular data by replacing trailing zeros with figure spaces.
 * @example formatFloatFixed(42, 2) → "42  " (with figure spaces)
 * @example formatFloatFixed(42.1, 2) → "42.1 " (with one figure space)
 */
export const formatFloatFixed = (value: number, decimals = 2): string => {
    return formatFloat(value, decimals, { minimumFractionDigits: decimals })
        .replace(/\.00$/, cSpacePunctuation + cSpaceFigure + cSpaceFigure)
        .replace(/\.0$/, cSpacePunctuation + cSpaceFigure)
        .replaceAll(/\.(\d)0$/g, `.$1${cSpaceFigure}`)
}

export const formatFloatWithUnit = (x: number, u: string): string =>
    `${formatSiFloat(x)}${cSpaceNarrowNoBreaking}${formatUnit(u)}`

export const formatReales = (x: number): string => `${formatUnit("R")}${cSpaceNarrowNoBreaking}${formatSiFloat(x)}`

export const formatWeight = (x: number): string => formatFloatWithUnit(x, "t")

/**
 * Rounds a number to specified decimal places.
 * @example round(3.14159, 2) → 3.14
 */
export const round = (n: number, d = 0): number => {
    const multiplier = 10 ** d
    return Math.round(n * multiplier) / multiplier
}

/**
 * Rounds a number to 3 decimal places (thousands precision).
 * @example roundToThousands(3.14159) → 3.142
 */
export const roundToThousands = (value: number): number => round(value, 3)

/**
 * Formats an integer (no decimal places).
 * @example formatInt(1234567) → "1 234 567"
 */
export const formatInt = (value: number, options: Intl.NumberFormatOptions = {}): string => {
    return formatNumber(value, 0, options)
}

/**
 * Formats an integer with explicit sign (+/-).
 * @example formatSignInt(42) → "+42"
 */
export const formatSignInt = (value: number): string => {
    return formatInt(value, { signDisplay: "always" })
}

/**
 * Format integer
 */
export const formatSiInt = (x: number, max = 2, options = {} as Intl.NumberFormatOptions): string =>
    formatNumber(x, 0, { ...options, maximumSignificantDigits: max })
