/**
 * Formats a floating-point number with specified decimal places.
 * @example formatFloat(1234.5678, 2) → "1 234.57"
 */
export declare const formatFloat: (value: number, decimals?: number, options?: Intl.NumberFormatOptions, svg?: boolean) => string;
/**
 * Formats a float with explicit sign (+/-).
 * @example formatSignFloat(42.5, 2) → "+42.50"
 * @example formatSignFloat(-42.5, 2) → "−42.50"
 */
export declare const formatSignFloat: (value: number, decimals?: number) => string;
/**
 * Formats a number with SI compact notation (K, M suffixes).
 * @example formatSiFloat(1234567) → "1.2 m" (where m is styled)
 */
export declare const formatSiFloat: (value: number, svg?: boolean) => string;
/**
 * Formats a float with fixed decimal places, using figure spaces for missing digits.
 * Ensures alignment in tabular data by replacing trailing zeros with figure spaces.
 * @example formatFloatFixed(42, 2) → "42  " (with figure spaces)
 * @example formatFloatFixed(42.1, 2) → "42.1 " (with one figure space)
 */
export declare const formatFloatFixed: (value: number, decimals?: number) => string;
/**
 * Rounds a number to specified decimal places.
 * @example round(3.14159, 2) → 3.14
 */
export declare const round: (value: number, decimals?: number) => number;
/**
 * Rounds a number to 3 decimal places (thousands precision).
 * @example roundToThousands(3.14159) → 3.142
 */
export declare const roundToThousands: (value: number) => number;
/**
 * Formats an integer (no decimal places).
 * @example formatInt(1234567) → "1 234 567"
 */
export declare const formatInt: (value: number, options?: Intl.NumberFormatOptions) => string;
/**
 * Formats an integer with explicit sign (+/-).
 * @example formatSignInt(42) → "+42"
 */
export declare const formatSignInt: (value: number) => string;
//# sourceMappingURL=number.d.ts.map