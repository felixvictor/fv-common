import "dayjs/locale/de";
import "dayjs/locale/en";
/**
 * Sets the active locale for date formatting.
 * @param locale - ISO locale code ('de' or 'en')
 */
export declare const setLocale: (locale: "de" | "en") => void;
/**
 * Gets the current active locale.
 */
export declare const getLocale: () => string;
/**
 * Formats date with locale-specific formatting.
 * @example getFormattedDate('2024-01-15') → "Montag, 15. Januar, 14.30" (de)
 */
export declare const getFormattedDate: (date: string) => string;
/**
 * Short date format with day, month, and time.
 * @example getFormattedDateShort('2024-01-15') → "15.1. 14.30"
 */
export declare const getFormattedDateShort: (date: number | string) => string;
/**
 * Date format with seconds included.
 * @example getFormattedDateShortSeconds('2024-01-15') → "15. Januar 14.30.45"
 */
export declare const getFormattedDateShortSeconds: (date: number | string) => string;
/**
 * Returns relative time string (e.g., "vor 2 Stunden" or "2 hours ago").
 * Uses currently active locale.
 */
export declare const getDateDistance: (date: string) => string;
/**
 * Checks if the given date is in the future.
 */
export declare const isFutureDate: (date: Date | string) => boolean;
/**
 * Finds the index of the date closest to now.
 * @returns Index of closest date, or undefined if array is empty
 */
export declare const closestDateIndex: (datesString: string[]) => number | undefined;
//# sourceMappingURL=date.d.ts.map