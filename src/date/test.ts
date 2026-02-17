import type { Dayjs } from "dayjs"

import dayjs from "dayjs"
import isBetween from "dayjs/plugin/isBetween.js"
import isSameOrBefore from "dayjs/plugin/isSameOrBefore.js"

import { datetimeFormat } from "./constants.js"

dayjs.extend(isBetween)
dayjs.extend(isSameOrBefore)

/**
 * Checks if a date falls within the next N hours from now
 * @param date - The date to check
 * @param hours - Number of hours from now to check within
 * @returns true if date is between now and now + hours
 */
export const isDateInRange = (date: Date, hours: number): boolean =>
    dayjs(date).isBetween(dayjs(), dayjs().add(hours, "hour"))

/**
 * Checks if the given date is in the future.
 */
export const isFutureDate = (date: Date | string): boolean => {
    return dayjs().isBefore(date)
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
 * Finds the index of the date closest to now.
 * @returns Index of closest date, or undefined if array is empty
 */
export const closestDateIndex = (datesString: string[]): number | undefined => {
    if (datesString.length === 0) return undefined

    const now = dayjs()
    const dateDiffs = datesString.map((date) => Math.abs(now.diff(date)))
    return dateDiffs.indexOf(Math.min(...dateDiffs))
}
