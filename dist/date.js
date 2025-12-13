import dayjs from "dayjs";
import "dayjs/locale/de";
import "dayjs/locale/en";
import relativeTime from "dayjs/plugin/relativeTime.js";
dayjs.extend(relativeTime);
// Default locale
let currentLocale = "de";
/**
 * Sets the active locale for date formatting.
 * @param locale - ISO locale code ('de' or 'en')
 */
export const setLocale = (locale) => {
    currentLocale = locale;
    dayjs.locale(locale);
};
/**
 * Gets the current active locale.
 */
export const getLocale = () => currentLocale;
// Initialise with default
setLocale("de");
/**
 * Formats date with locale-specific formatting.
 * @example getFormattedDate('2024-01-15') → "Montag, 15. Januar, 14.30" (de)
 */
export const getFormattedDate = (date) => {
    return dayjs(date).format("dddd, D. MMMM, H.mm");
};
/**
 * Short date format with day, month, and time.
 * @example getFormattedDateShort('2024-01-15') → "15.1. 14.30"
 */
export const getFormattedDateShort = (date) => {
    return dayjs(date).format("D.M. H.mm");
};
/**
 * Date format with seconds included.
 * @example getFormattedDateShortSeconds('2024-01-15') → "15. Januar 14.30.45"
 */
export const getFormattedDateShortSeconds = (date) => {
    return dayjs(date).format("D. MMMM H.mm.ss");
};
/**
 * Returns relative time string (e.g., "vor 2 Stunden" or "2 hours ago").
 * Uses currently active locale.
 */
export const getDateDistance = (date) => {
    return dayjs(date).fromNow();
};
/**
 * Checks if the given date is in the future.
 */
export const isFutureDate = (date) => {
    return dayjs().isBefore(date);
};
/**
 * Finds the index of the date closest to now.
 * @returns Index of closest date, or undefined if array is empty
 */
export const closestDateIndex = (datesString) => {
    if (datesString.length === 0)
        return undefined;
    const now = dayjs();
    const dateDiffs = datesString.map((date) => Math.abs(now.diff(date)));
    return dateDiffs.indexOf(Math.min(...dateDiffs));
};
//# sourceMappingURL=date.js.map