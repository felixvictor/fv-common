import { formatWithIntl } from "./intl.js"

/**
 * Formats a decimal value as a percentage.
 * @param value - Decimal value (e.g., 0.42 for 42%)
 * @param decimals - Number of decimal places
 * @example formatPercent(0.4567, 1) → "45.7 %"
 */
export const formatPercent = (value: number, decimals = 1, options: Intl.NumberFormatOptions = {}): string => {
    return formatWithIntl(value, {
        maximumFractionDigits: decimals,
        ...options,
        style: "percent",
    })
}

/**
 * Formats a percentage with explicit sign (+/-).
 * @example formatSignPercent(0.42, 1) → "+42.0 %"
 */
export const formatSignPercent = (value: number, decimals = 1): string => {
    return formatPercent(value, decimals, { signDisplay: "always" })
}
