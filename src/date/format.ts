import "dayjs/locale/de.js"
import "dayjs/locale/en.js"
import "dayjs/locale/en-gb.js"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat.js"
import relativeTime from "dayjs/plugin/relativeTime.js"
import timezone from "dayjs/plugin/timezone.js"
import utc from "dayjs/plugin/utc.js"

import { getLocale, onLocaleChange, setLocale as setLibraryLocale } from "../locale.js"
import { cDashEn, cSpaceNoBreak } from "../unicode.js"
import { datetimeFormat } from "./constants.js"
import { getLocalHour } from "./convert"

dayjs.extend(relativeTime)
dayjs.extend(customParseFormat)
dayjs.extend(timezone)
dayjs.extend(utc)

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
 * Short date format with day, month, and time in local timezone.
 * @param date - The date to format
 * @param locale - Optional locale (defaults to current locale)
 * @returns Formatted date string
 * @example getFormattedDateShort('2024-01-15') → "15.1. 14.30"
 */
export const getFormattedDateShort = (date: number | string, locale?: string): string => {
    const effectiveLocale = locale ?? getLocale()
    return dayjs(date).locale(effectiveLocale).format("D.M. H.mm")
}

/**
 * Short date format with day, full month name, and time.
 * Converts UTC date to Berlin timezone.
 * @param date - The UTC date to format
 * @param locale - Optional locale (defaults to current locale)
 * @returns Formatted date string in Berlin time
 * @example getFormattedShortDateFromUTC('2024-01-15T13:30:00Z') → "15. Januar, 14.30"
 */
export const getFormattedShortDateFromUTC = (date: Date | string, locale?: string): string => {
    const effectiveLocale = locale ?? getLocale()
    return dayjs.utc(date).tz("Europe/Berlin").locale(effectiveLocale).format("D. MMMM, H.mm")
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

// ============================================================================
// Time Formatting
// ============================================================================

/**
 * Formats a datetime string as relative time (e.g., "2 hours ago").
 *
 * @param time - Datetime string in YYYY-MM-DD HH:mm format.
 * @returns Relative time string.
 *
 * @example
 * getRelativeTime("2024-01-15 10:00") // "2 hours ago"
 */
export const getRelativeTime = (time: string): string => {
    return dayjs.utc(time, datetimeFormat).fromNow()
}

/**
 * Formats a datetime string in UTC.
 *
 * @param time - Datetime string in YYYY-MM-DD HH:mm format.
 * @returns Formatted UTC datetime string.
 *
 * @example
 * formatDate("2024-01-15 10:00") // "2024-01-15 10:00"
 */
export const formatDate = (time: string): string => {
    return dayjs.utc(time, datetimeFormat).format(datetimeFormat)
}

/**
 * Formats a datetime string as time only in UTC.
 *
 * @param time - Datetime string in YYYY-MM-DD HH:mm format.
 * @returns Formatted UTC time string (H:mm).
 *
 * @example
 * formatTime("2024-01-15 10:30") // "10:30"
 */
export const formatTime = (time: string): string => {
    return dayjs.utc(time, datetimeFormat).format("H:mm")
}

/**
 * Formats a datetime string in local timezone.
 *
 * @param time - Datetime string in YYYY-MM-DD HH:mm format.
 * @returns Formatted local datetime string.
 *
 * @example
 * formatLocalDate("2024-01-15 10:00") // "2024-01-15 14:00" (if local is UTC+4)
 */
export const formatLocalDate = (time: string): string => {
    return dayjs.utc(time, datetimeFormat).local().format(datetimeFormat)
}

/**
 * Formats a datetime string as time only in local timezone.
 *
 * @param time - Datetime string in YYYY-MM-DD HH:mm format.
 * @returns Formatted local time string (H:mm).
 *
 * @example
 * formatLocalTime("2024-01-15 10:00") // "14:00" (if local is UTC+4)
 */
export const formatLocalTime = (time: string): string => {
    return dayjs.utc(time, datetimeFormat).local().format("H:mm")
}

/**
 * Formats a time range as HTML with non-breaking spaces.
 *
 * @param from - Starting hour.
 * @param to - Ending hour.
 * @returns HTML string with formatted time range.
 */
export const formatFromToTime = (from: number, to: number): string => {
    return `<span class="text-no-wrap">${from}${cSpaceNoBreak}${cDashEn}${cSpaceNoBreak}${to}</span>`
}

/**
 * Formats a time range showing both UTC and local times.
 *
 * @param from - Starting hour in UTC.
 * @param to - Ending hour in UTC.
 * @returns HTML string with UTC and local time ranges.
 */
export const formatTimeRange = (from: number, to: number): string => {
    const fromLocal = getLocalHour(from)
    const toLocal = getLocalHour(to)
    return `${formatFromToTime(from, to)} (${formatFromToTime(fromLocal, toLocal)}${cSpaceNoBreak}local)`
}
