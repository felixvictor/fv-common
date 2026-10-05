/**
 * Formatting of Temporal values and date-time strings.
 *
 * The string-based helpers (`getFormatted*`, `format*Time`, `format*Date`) throw a RangeError on unparsable input.
 */
import { getLocale } from "@/locale"
import { berlinTimeZone, datetimeFormat, utcTimeZone } from "@/temporal/constants"
import { dateToString, getLocalHour, parseUtcDateTime, toInstant, toZonedDateTime } from "@/temporal/convert"
import { formatPattern } from "@/temporal/pattern"
import { cDashEn, cSpaceNoBreak } from "@/unicode"

const durationFormatOptions: Intl.DurationFormatOptions = {
    style: "long",
}
const dateFormatOptions: Intl.DateTimeFormatOptions = {
    dateStyle: "short",
}
const dateTimeFormatOptions: Intl.DateTimeFormatOptions = {
    dateStyle: "short",
    timeStyle: "short",
}
const timeFormatOptions: Intl.DateTimeFormatOptions = { hour: "numeric", hourCycle: "h23", minute: "numeric" }

const timePattern = "H:mm"

const requireUtcDateTime = (time: string): Temporal.ZonedDateTime => {
    const dateTime = parseUtcDateTime(time)
    if (dateTime === undefined) throw new RangeError(`"${time}" does not match "${datetimeFormat}"`)

    return dateTime
}

export const formatMs = (ms: number, options = durationFormatOptions, locale?: string): string => {
    const effectiveLocale = locale ?? getLocale()
    const duration = Temporal.Duration.from({ milliseconds: ms }).round({
        largestUnit: "hour",
        relativeTo: Temporal.Now.zonedDateTimeISO(),
    })

    // Built per call
    const timeFormatter = new Intl.DurationFormat(effectiveLocale, options)

    return timeFormatter.format(duration)
}

export const formatPlainTime = (time: Temporal.PlainTime, options = timeFormatOptions, locale?: string): string => {
    const effectiveLocale = locale ?? getLocale()
    const formatter = new Intl.DateTimeFormat(effectiveLocale, options)

    return formatter
        .formatToParts(time)
        .map((part) => (part.type === "hour" ? String(Number(part.value)) : part.value))
        .join("")
}

/** Formats the calendar date of `date` (system time zone); defaults to the short date style. */
export const formatDate = (date: Date, options = dateFormatOptions, locale?: string): string => {
    const effectiveLocale = locale ?? getLocale()
    return Temporal.PlainDate.from(dateToString(date)).toLocaleString(effectiveLocale, options)
}

/** Formats an ISO date string (`YYYY-MM-DD`); defaults to the short date style. */
export const formatDateString = (dateString: string, options = dateFormatOptions, locale?: string): string => {
    const effectiveLocale = locale ?? getLocale()
    return Temporal.PlainDate.from(dateString).toLocaleString(effectiveLocale, options)
}

export const formatDuration = (
    duration: Temporal.Duration,
    options = durationFormatOptions,
    locale?: string,
): string => {
    const effectiveLocale = locale ?? getLocale()
    return duration.toLocaleString(effectiveLocale, options)
}

export const formatInstant = (instant: Temporal.Instant, options = dateTimeFormatOptions, locale?: string): string => {
    const effectiveLocale = locale ?? getLocale()
    return instant.toLocaleString(effectiveLocale, options)
}

/**
 * Long date with weekday, month name and time in the system time zone.
 *
 * @example
 *     getFormattedDate("2024-01-15T14:30", "de") // "Montag, 15. Januar, 14.30" (no-break space after "15.")
 *
 * @param date - ISO 8601 string; without offset it is read as system time.
 * @param locale - Defaults to the library locale.
 */
export const getFormattedDate = (date: string, locale?: string): string =>
    formatPattern(toZonedDateTime(date), "dddd, D. MMMM, H.mm", locale).replace(". ", `.${cSpaceNoBreak}`)

/**
 * Short date with day, month and time in the system time zone.
 *
 * @example
 *     getFormattedDateShort("2024-01-15T14:30") // "15.1. 14.30"
 *
 * @param date - Epoch milliseconds or ISO 8601 string; without offset it is read as system time.
 * @param locale - Defaults to the library locale.
 */
export const getFormattedDateShort = (date: number | string, locale?: string): string =>
    formatPattern(toZonedDateTime(date), "D.M. H.mm", locale)

/**
 * Short date with month name and time in Berlin time.
 *
 * @example
 *     getFormattedShortDateFromUTC("2024-01-15T13:30:00Z", "de") // "15. Januar, 14.30"
 *
 * @param date - `Date` or ISO 8601 string; without offset it is read as UTC.
 * @param locale - Defaults to the library locale.
 */
export const getFormattedShortDateFromUTC = (date: Date | string, locale?: string): string =>
    formatPattern(toInstant(date, utcTimeZone).toZonedDateTimeISO(berlinTimeZone), "D. MMMM, H.mm", locale)

/**
 * Date with month name and time including seconds in the system time zone.
 *
 * @example
 *     getFormattedDateShortSeconds("2024-01-15T14:30:45", "de") // "15. Januar 14.30.45"
 *
 * @param date - Epoch milliseconds or ISO 8601 string; without offset it is read as system time.
 * @param locale - Defaults to the library locale.
 */
export const getFormattedDateShortSeconds = (date: number | string, locale?: string): string =>
    formatPattern(toZonedDateTime(date), "D. MMMM H.mm.ss", locale)

/**
 * Normalises a UTC datetime string.
 *
 * @example
 *     formatUtcDateTime("2024-01-15 10:00") // "2024-01-15 10:00"
 *
 * @param time - UTC datetime string in {@link datetimeFormat}.
 */
export const formatUtcDateTime = (time: string): string => formatPattern(requireUtcDateTime(time), datetimeFormat)

/** @deprecated Use {@link formatUtcDateTime}. */
export const formatDateViaDayjs = formatUtcDateTime

/**
 * Time of a UTC datetime string in UTC.
 *
 * @example
 *     formatTime("2024-01-15 10:30") // "10:30"
 *
 * @param time - UTC datetime string in {@link datetimeFormat}.
 */
export const formatTime = (time: string): string => formatPattern(requireUtcDateTime(time), timePattern)

/**
 * UTC datetime string converted to local time.
 *
 * @example
 *     formatLocalDate("2024-01-15 10:00", "Europe/Berlin") // "2024-01-15 11:00"
 *
 * @param time - UTC datetime string in {@link datetimeFormat}.
 * @param timeZone - Target time zone; defaults to the system time zone.
 */
export const formatLocalDate = (time: string, timeZone: string = Temporal.Now.timeZoneId()): string =>
    formatPattern(requireUtcDateTime(time).withTimeZone(timeZone), datetimeFormat)

/**
 * Time of a UTC datetime string converted to local time.
 *
 * @example
 *     formatLocalTime("2024-01-15 10:00", "Europe/Berlin") // "11:00"
 *
 * @param time - UTC datetime string in {@link datetimeFormat}.
 * @param timeZone - Target time zone; defaults to the system time zone.
 */
export const formatLocalTime = (time: string, timeZone: string = Temporal.Now.timeZoneId()): string =>
    formatPattern(requireUtcDateTime(time).withTimeZone(timeZone), timePattern)

/**
 * Formats an hour range as HTML that does not wrap.
 *
 * @returns HTML string, e.g. `<span class="text-no-wrap">10 – 12</span>` with no-break spaces.
 */
export const formatFromToTime = (from: number, to: number): string =>
    `<span class="text-no-wrap">${from}${cSpaceNoBreak}${cDashEn}${cSpaceNoBreak}${to}</span>`

/**
 * Formats a UTC hour range followed by the same range in local time.
 *
 * @param from - Starting hour in UTC.
 * @param to - Ending hour in UTC.
 * @param timeZone - Local time zone; defaults to the system time zone.
 * @returns HTML string with UTC and local hour ranges.
 */
export const formatTimeRange = (from: number, to: number, timeZone: string = Temporal.Now.timeZoneId()): string => {
    const fromLocal = getLocalHour(from, timeZone)
    const toLocal = getLocalHour(to, timeZone)

    return `${formatFromToTime(from, to)} (${formatFromToTime(fromLocal, toLocal)}${cSpaceNoBreak}local)`
}
