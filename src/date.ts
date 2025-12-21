import dayjs from "dayjs"
import "dayjs/locale/de"
import "dayjs/locale/en"
import relativeTime from "dayjs/plugin/relativeTime"

import { getLocale, onLocaleChange, setLocale as setLibraryLocale } from "./locale.js"

dayjs.extend(relativeTime)

// Wrapper to sync dayjs locale with library locale
export const setDateLocale = (locale: string): void => {
    setLibraryLocale(locale)
    dayjs.locale(locale)
}

// Sync dayjs locale on any locale changes
onLocaleChange(() => {
    dayjs.locale(getLocale())
})

// Initialise with default
setDateLocale("en-GB")

/**
 * Formats date with locale-specific formatting.
 * @param date - Date string to format
 * @param locale - Optional locale override
 * @example getFormattedDate('2024-01-15') → "Montag, 15. Januar, 14.30" (de)
 * @example getFormattedDate('2024-01-15', 'en') → "Monday, 15. January, 14.30"
 */
export const getFormattedDate = (date: string, locale?: string): string => {
    const effectiveLocale = locale ?? getLocale()
    return dayjs(date).locale(effectiveLocale).format("dddd, D. MMMM, H.mm")
}

/**
 * Short date format with day, month, and time.
 * @example getFormattedDateShort('2024-01-15') → "15.1. 14.30"
 */
export const getFormattedDateShort = (date: number | string, locale?: string): string => {
    const effectiveLocale = locale ?? getLocale()
    return dayjs(date).locale(effectiveLocale).format("D.M. H.mm")
}

/**
 * Date format with seconds included.
 * @example getFormattedDateShortSeconds('2024-01-15') → "15. Januar 14.30.45"
 */
export const getFormattedDateShortSeconds = (date: number | string, locale?: string): string => {
    const effectiveLocale = locale ?? getLocale()
    return dayjs(date).locale(effectiveLocale).format("D. MMMM H.mm.ss")
}

/**
 * Returns relative time string (e.g., "vor 2 Stunden" or "2 hours ago").
 * Uses currently active locale.
 */
export const getDateDistance = (date: string, locale?: string): string => {
    const effectiveLocale = locale ?? getLocale()
    return dayjs(date).locale(effectiveLocale).fromNow()
}

/**
 * Checks if the given date is in the future.
 */
export const isFutureDate = (date: Date | string): boolean => {
    return dayjs().isBefore(date)
}

/**
 * Finds the index of the date closest to now.
 * @returns Index of closest date, or undefined if array is empty
 */
export const closestDateIndex = (datesString: string[]): number | undefined => {
    if (datesString.length === 0) return undefined

    const now = dayjs()
    const dateDiffs = datesString.map((date) => Math.abs(now.diff(date)))
    return dateDiffs.indexOf(Math.min(...dateDiffs))
}
