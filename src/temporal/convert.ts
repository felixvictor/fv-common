/**
 * Conversions between strings, `Date`, epoch milliseconds and Temporal types.
 *
 * The `to*` helpers throw a RangeError on invalid input, the `parse*` helpers return undefined. An ISO 8601 string with
 * offset or `Z` denotes an exact instant; any other ISO 8601 date or date-time string (`T` or space separator) is
 * wall-clock time in the given time zone.
 */
import { berlinTimeZone, datetimeFormat, deDatetimeFormat, utcTimeZone } from "@/temporal/constants"
import { formatPattern, parsePattern } from "@/temporal/pattern"

/** Point in time as `Date`, epoch milliseconds, ISO 8601 string or `Temporal.Instant`. */
export type DateTimeInput = Date | number | string | Temporal.Instant

/** First and last instant of a date list, see {@link getRange}. */
export interface InstantRange {
    begin: Temporal.Instant
    end: Temporal.Instant
}

const fractionalSecondDigits = 3

const parseInstantString = (value: string, timeZone: string): Temporal.Instant => {
    try {
        return Temporal.Instant.from(value)
    } catch {
        // No offset: wall-clock time in the given time zone
        return Temporal.PlainDateTime.from(value).toZonedDateTime(timeZone).toInstant()
    }
}

/**
 * Converts a point in time to an instant.
 *
 * @param value - Point in time; numbers are epoch milliseconds.
 * @param timeZone - Time zone for strings without offset; defaults to the system time zone.
 * @throws {RangeError} If `value` is an invalid date or string.
 */
export const toInstant = (value: DateTimeInput, timeZone: string = Temporal.Now.timeZoneId()): Temporal.Instant => {
    if (value instanceof Temporal.Instant) return value
    if (value instanceof Date) return Temporal.Instant.fromEpochMilliseconds(value.getTime())
    if (typeof value === "number") return Temporal.Instant.fromEpochMilliseconds(value)

    return parseInstantString(value, timeZone)
}

/**
 * Converts a point in time to a date-time in `timeZone`.
 *
 * @param value - Point in time; numbers are epoch milliseconds.
 * @param timeZone - Time zone for interpretation and result; defaults to the system time zone.
 * @throws {RangeError} If `value` is an invalid date or string.
 */
export const toZonedDateTime = (
    value: DateTimeInput,
    timeZone: string = Temporal.Now.timeZoneId(),
): Temporal.ZonedDateTime => toInstant(value, timeZone).toZonedDateTimeISO(timeZone)

/** Converts an instant to a `Date` (millisecond precision). */
export const toDate = (instant: Temporal.Instant): Date => new Date(instant.epochMilliseconds)

/**
 * Non-throwing variant of {@link toInstant}.
 *
 * @returns The instant, or undefined if `value` is an invalid date or string.
 */
export const parseInstant = (
    value: DateTimeInput,
    timeZone: string = Temporal.Now.timeZoneId(),
): Temporal.Instant | undefined => {
    try {
        return toInstant(value, timeZone)
    } catch (error: unknown) {
        if (error instanceof RangeError) return undefined
        throw error
    }
}

/**
 * Parses a string with a format pattern (see {@link parsePattern}) as wall-clock time in `timeZone`.
 *
 * @returns The date-time, or undefined if `value` does not match `pattern`.
 */
export const parseZonedDateTime = (
    value: string,
    pattern: string,
    timeZone: string = Temporal.Now.timeZoneId(),
): Temporal.ZonedDateTime | undefined => parsePattern(value, pattern)?.toZonedDateTime(timeZone)

/**
 * Parses a {@link datetimeFormat} string (`YYYY-MM-DD HH:mm`) as UTC.
 *
 * @returns The date-time in UTC, or undefined if `time` does not match.
 */
export const parseUtcDateTime = (time: string): Temporal.ZonedDateTime | undefined =>
    parseZonedDateTime(time, datetimeFormat, utcTimeZone)

/**
 * Converts a date to its calendar date in the system time zone.
 *
 * @returns ISO date string (`YYYY-MM-DD`).
 */
export const dateToString = (date: Date): string => {
    const plainDate = new Temporal.PlainDate(date.getFullYear(), date.getMonth() + 1, date.getDate())

    return plainDate.toString()
}

/**
 * Converts a German date-time string (`DD.MM.YYYY HH:mm`, system time zone) to an ISO 8601 UTC string.
 *
 * @example
 *     convertDEDateString("15.01.2024 10:30") // "2024-01-15T09:30:00.000Z" (system time zone Europe/Berlin)
 *
 * @throws {RangeError} If `date` does not match the layout exactly or names a time skipped by a daylight saving
 *   transition.
 */
export const convertDEDateString = (date: string): string => {
    const errorMessage = `Invalid German date-time string "${date}"`
    const plainDateTime = parsePattern(date, deDatetimeFormat, { isStrict: true })
    if (plainDateTime === undefined) throw new RangeError(errorMessage)

    // A wall-clock time skipped by a transition is shifted and differs from the input
    const dateTime = plainDateTime.toZonedDateTime(Temporal.Now.timeZoneId())
    if (!dateTime.toPlainDateTime().equals(plainDateTime)) throw new RangeError(errorMessage)

    return dateTime.toInstant().toString({ fractionalSecondDigits })
}

/**
 * Returns the first and last element of a date list as instants.
 *
 * @example
 *     const { begin, end } = getRange([new Date("2024-01-01"), new Date("2024-01-31")])
 *
 * @returns Both ends; an empty list yields the current instant for both.
 */
export const getRange = (dateRange: readonly Date[]): InstantRange => {
    const now = Temporal.Now.instant()
    const first = dateRange.at(0)
    const last = dateRange.at(-1)

    return { begin: first === undefined ? now : toInstant(first), end: last === undefined ? now : toInstant(last) }
}

/**
 * Converts the full hour `hour` of today's UTC date to the hour in `timeZone`. Hours outside 0–23 roll over, so 24 is
 * midnight of the next day.
 *
 * @param hour - Hour in UTC.
 * @param timeZone - Target time zone; defaults to the system time zone.
 * @returns Hour in `timeZone` (0–23).
 */
export const getLocalHour = (hour: number, timeZone: string = Temporal.Now.timeZoneId()): number =>
    Temporal.Now.zonedDateTimeISO(utcTimeZone)
        .startOfDay()
        .add({ hours: Math.trunc(hour) })
        .withTimeZone(timeZone).hour

/**
 * Converts a UTC string to a `Date`. Strings without offset are read as UTC.
 *
 * @throws {RangeError} If `date` is not a valid ISO 8601 string.
 */
export const convertUTCStringToDate = (date: string): Date => toDate(toInstant(date, utcTimeZone))

/**
 * Converts a Berlin wall-clock string to a `Date`. Strings without offset are read as Europe/Berlin time; strings with
 * offset or `Z` are exact instants.
 *
 * @throws {RangeError} If `date` is not a valid ISO 8601 string.
 */
export const convertBerlinTimeToUTC = (date: string): Date => toDate(toInstant(date, berlinTimeZone))

/**
 * Re-formats a date string from one format pattern (see {@link formatPattern}) to another.
 *
 * @example
 *     convertDate("15.01.2024", "DD.MM.YYYY", "D. MMMM YYYY", "de") // "15. Januar 2024"
 *
 * @param locale - Locale for month and weekday names; defaults to the library locale.
 * @returns The re-formatted string, or undefined if `date` does not match `fromFormat`.
 */
export const convertDate = (
    date: string,
    fromFormat: string,
    toFormat: string,
    locale?: string,
): string | undefined => {
    const plainDateTime = parsePattern(date, fromFormat, { locale })

    return plainDateTime === undefined ? undefined : formatPattern(plainDateTime, toFormat, locale)
}
