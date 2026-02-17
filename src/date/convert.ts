import dayjs, { type Dayjs } from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat.js"
import utc from "dayjs/plugin/utc.js"

dayjs.extend(customParseFormat)
dayjs.extend(utc)

export const convertDEDateString = (date: string): string => dayjs(date, "DD.MM.YYYY HH:mm", true).toISOString()

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

export const convertUTCStringToDate = (date: string): Date => dayjs.utc(date).toDate()

export const convertDate = (date: string, fromFormat: string, toFormat: string, locale: string): string | undefined => {
    const from = dayjs(date, fromFormat, locale)
    if (!from.isValid()) return undefined
    return from.format(toFormat)
}
