/**
 * Comparisons and predicates for Temporal values and date-time strings.
 *
 * The string- and `Date`-based predicates return false for unparsable input. Functions that depend on the current time
 * accept an optional `now` for deterministic use.
 */
import { datetimeFormat } from "@/temporal/constants"
import { parseInstant, parseUtcDateTime, parseZonedDateTime } from "@/temporal/convert"

const millisecondsPerHour = 3_600_000

export const isTimeBetween = (time: Temporal.PlainTime, start: Temporal.PlainTime, end: Temporal.PlainTime): boolean =>
    Temporal.PlainTime.compare(time, start) >= 0 && Temporal.PlainTime.compare(time, end) < 0

export const isInstantAfter = (instant1: Temporal.Instant, instant2: Temporal.Instant): boolean =>
    Temporal.Instant.compare(instant1, instant2) > 0

export const isInstantAtOrAfter = (instant1: Temporal.Instant, instant2: Temporal.Instant): boolean =>
    Temporal.Instant.compare(instant1, instant2) >= 0

export const isInstantAtOrBefore = (instant1: Temporal.Instant, instant2: Temporal.Instant): boolean =>
    Temporal.Instant.compare(instant1, instant2) <= 0

export const isInstantBefore = (instant1: Temporal.Instant, instant2: Temporal.Instant): boolean =>
    Temporal.Instant.compare(instant1, instant2) < 0

/**
 * Checks whether `date` lies within the next `hours` hours (both ends exclusive).
 *
 * @param date - Date to check.
 * @param hours - Window length in hours; fractions are allowed.
 * @param now - Start of the window; defaults to the current instant.
 */
export const isDateInRange = (date: Date, hours: number, now: Temporal.Instant = Temporal.Now.instant()): boolean => {
    const instant = parseInstant(date)
    if (instant === undefined) return false

    const windowEnd = now.add({ milliseconds: Math.round(hours * millisecondsPerHour) })
    return isInstantAfter(instant, now) && isInstantBefore(instant, windowEnd)
}

/**
 * Checks whether `date` lies in the future.
 *
 * @param date - `Date` or ISO 8601 string; without offset it is read as system time.
 * @param now - Reference instant; defaults to the current instant.
 */
export const isFutureDate = (date: Date | string, now: Temporal.Instant = Temporal.Now.instant()): boolean => {
    const instant = parseInstant(date)
    return instant !== undefined && isInstantAfter(instant, now)
}

/**
 * Checks whether a UTC datetime string lies in the past or at the current moment.
 *
 * @example
 *     isPastDate("2024-01-15 10:00") // true once 10:00 UTC on 15 January 2024 has passed
 *
 * @param time - UTC datetime string in {@link datetimeFormat}.
 * @param now - Reference instant; defaults to the current instant.
 */
export const isPastDate = (time: string, now: Temporal.Instant = Temporal.Now.instant()): boolean => {
    const dateTime = parseUtcDateTime(time)
    return dateTime !== undefined && isInstantAtOrBefore(dateTime.toInstant(), now)
}

/**
 * Checks whether the hour of a local datetime string lies within `(begin, end]`. The time is truncated to the full hour
 * before comparing; `begin` and `end` are compared exactly.
 *
 * @example
 *     isBetweenTime("2024-01-15 15:00", Temporal.Instant.from("2024-01-15T09:00Z"), Temporal.Instant.from("2024-01-15T19:00Z")) // true
 *
 * @param time - Datetime string in {@link datetimeFormat}, read as system time.
 * @param begin - Exclusive start.
 * @param end - Inclusive end.
 */
export const isBetweenTime = (time: string | undefined, begin: Temporal.Instant, end: Temporal.Instant): boolean => {
    if (time === undefined) return false

    const dateTime = parseZonedDateTime(time, datetimeFormat)
    if (dateTime === undefined) return false

    const startOfHour = dateTime.round({ roundingMode: "floor", smallestUnit: "hour" }).toInstant()
    return isInstantBefore(begin, startOfHour) && isInstantAtOrBefore(startOfHour, end)
}
