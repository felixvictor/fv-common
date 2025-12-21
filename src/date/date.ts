import type { Dayjs } from "dayjs"

import "dayjs/locale/de"
import "dayjs/locale/en"
import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat"
import "dayjs/locale/en-gb"
import isBetween from "dayjs/plugin/isBetween"
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"
import relativeTime from "dayjs/plugin/relativeTime"
import utc from "dayjs/plugin/utc"

import { getLocale, onLocaleChange, setLocale as setLibraryLocale } from "../locale.js"
import { cDashEn, cSpaceNoBreak } from "../unicode.js"
import { datetimeFormat } from "./constants.js"

dayjs.extend(relativeTime)
dayjs.extend(customParseFormat)
dayjs.extend(isBetween)
dayjs.extend(isSameOrBefore)
dayjs.extend(relativeTime)
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
 * Checks if a datetime is in the past (or current moment).
 *
 * @param time - Datetime string in YYYY-MM-DD HH:mm format.
 * @returns True if the time is same or before now.
 *
 * @example
 * isPastDate("2024-01-15 10:00") // true if current time is after this
 */
export const isPastDate = (time: string): boolean => {
    return dayjs.utc(time, datetimeFormat).isSameOrBefore(dayjs.utc())
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
 * Checks if a time falls within a given range.
 *
 * @param time - Datetime string in YYYY-MM-DD HH:mm format (or undefined).
 * @param begin - Start of the time range.
 * @param end - End of the time range.
 * @returns True if time is within range (exclusive start, inclusive end).
 *
 * @example
 * const begin = dayjs("2024-01-15 10:00")
 * const end = dayjs("2024-01-15 20:00")
 * isBetweenTime("2024-01-15 15:00", begin, end) // true
 */
export const isBetweenTime = (time: string | undefined, begin: Dayjs, end: Dayjs): boolean => {
    if (!time) return false
    return dayjs(time, datetimeFormat).isBetween(begin, end, "hour", "(]")
}

/**
 * Converts a date range array to begin/end Dayjs objects.
 *
 * @param dateRange - Array of Date objects.
 * @returns Object with begin and end Dayjs objects.
 *
 * @example
 * const dates = [new Date("2024-01-01"), new Date("2024-01-31")]
 * const { begin, end } = getRange(dates)
 */
export const getRange = (dateRange: Date[]): { begin: Dayjs; end: Dayjs } => {
    const begin = dayjs(dateRange[0])
    const end = dayjs(dateRange.at(-1))
    return { begin, end }
}

/**
 * Converts a UTC hour to local hour.
 *
 * @param hour - Hour in UTC (0-23).
 * @returns Hour in local timezone (0-23).
 */
export const getLocalHour = (hour: number): number => {
    return Number(dayjs.utc().hour(hour).local().format("H"))
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
