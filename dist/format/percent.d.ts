/**
 * Formats a decimal value as a percentage.
 * @param value - Decimal value (e.g., 0.42 for 42%)
 * @param decimals - Number of decimal places
 * @example formatPercent(0.4567, 1) → "45.7 %"
 */
export declare const formatPercent: (value: number, decimals?: number, options?: Intl.NumberFormatOptions) => string;
/**
 * Formats a percentage with explicit sign (+/-).
 * @example formatSignPercent(0.42, 1) → "+42.0 %"
 */
export declare const formatSignPercent: (value: number, decimals?: number) => string;
//# sourceMappingURL=percent.d.ts.map