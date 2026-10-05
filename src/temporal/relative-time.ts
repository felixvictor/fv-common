/**
 * Relative time ("2 hours ago", "in 3 days").
 *
 * The unit is chosen with the thresholds of the Moment.js/Day.js relative-time convention; wording comes from
 * `Intl.RelativeTimeFormat`. Distances up to 44 seconds read "now", all others are numeric ("1 hour ago").
 */
import { getLocale } from "@/locale"
import { datetimeFormat } from "@/temporal/constants"
import { parseUtcDateTime, toZonedDateTime } from "@/temporal/convert"

interface RelativeTimeThreshold {
    /** Unit shown. */
    readonly displayUnit: RelativeTimeUnit
    /** Fixed value shown for this threshold; the measured distance otherwise. */
    readonly fixedValue?: number
    /** Largest rounded distance in {@link measureUnit} covered; undefined for no limit. */
    readonly maximumValue: number | undefined
    /** Unit the distance is measured and rounded in. */
    readonly measureUnit: RelativeTimeUnit
}

type RelativeTimeUnit = "day" | "hour" | "minute" | "month" | "second" | "year"

/** Unit thresholds, checked in order; the first one whose maximum is not exceeded applies. */
const thresholds: readonly RelativeTimeThreshold[] = [
    { displayUnit: "second", fixedValue: 0, maximumValue: 44, measureUnit: "second" },
    { displayUnit: "minute", fixedValue: 1, maximumValue: 89, measureUnit: "second" },
    { displayUnit: "minute", maximumValue: 44, measureUnit: "minute" },
    { displayUnit: "hour", fixedValue: 1, maximumValue: 89, measureUnit: "minute" },
    { displayUnit: "hour", maximumValue: 21, measureUnit: "hour" },
    { displayUnit: "day", fixedValue: 1, maximumValue: 35, measureUnit: "hour" },
    { displayUnit: "day", maximumValue: 25, measureUnit: "day" },
    { displayUnit: "month", fixedValue: 1, maximumValue: 45, measureUnit: "day" },
    { displayUnit: "month", maximumValue: 10, measureUnit: "month" },
    { displayUnit: "year", fixedValue: 1, maximumValue: 17, measureUnit: "month" },
    { displayUnit: "year", maximumValue: undefined, measureUnit: "year" },
]

/** Rounded absolute distance in `unit`; calendar units respect the time zone of `target`. */
const measureDistance = (target: Temporal.ZonedDateTime, now: Temporal.ZonedDateTime, unit: RelativeTimeUnit): number =>
    Math.abs(
        target
            .since(now, { largestUnit: unit, roundingMode: "halfExpand", smallestUnit: unit })
            .total({ relativeTo: now, unit }),
    )

/**
 * Formats the distance from `now` to `target` as localised relative time.
 *
 * @example
 *     formatRelativeTime(Temporal.Now.zonedDateTimeISO().subtract({ hours: 2 }), "en") // "2 hours ago"
 *
 * @param target - Point in time to describe.
 * @param locale - Defaults to the library locale.
 * @param now - Reference instant; defaults to the current instant.
 */
export const formatRelativeTime = (
    target: Temporal.ZonedDateTime,
    locale?: string,
    now: Temporal.Instant = Temporal.Now.instant(),
): string => {
    const effectiveLocale = locale ?? getLocale()
    const zonedNow = now.toZonedDateTimeISO(target.timeZoneId)
    const isFuture = Temporal.ZonedDateTime.compare(target, zonedNow) > 0

    for (const { displayUnit, fixedValue, maximumValue, measureUnit } of thresholds) {
        const distance = measureDistance(target, zonedNow, measureUnit)

        if (maximumValue === undefined || distance <= maximumValue) {
            const value = fixedValue ?? distance
            // "now" for the zero distance, numeric wording otherwise ("1 day ago" rather than "yesterday")
            const formatter = new Intl.RelativeTimeFormat(effectiveLocale, { numeric: value === 0 ? "auto" : "always" })

            return formatter.format(isFuture ? value : -value, displayUnit)
        }
    }

    throw new RangeError("No relative time threshold matched")
}

/**
 * Relative time of an ISO 8601 string.
 *
 * @example
 *     getDateDistance("2024-01-15T10:00", "de") // "vor 2 Stunden"
 *
 * @param date - ISO 8601 string; without offset it is read as system time.
 * @param locale - Defaults to the library locale.
 * @param now - Reference instant; defaults to the current instant.
 * @throws {RangeError} If `date` is not a valid ISO 8601 string.
 */
export const getDateDistance = (date: string, locale?: string, now?: Temporal.Instant): string =>
    formatRelativeTime(toZonedDateTime(date), locale, now)

/**
 * Relative time of a UTC datetime string.
 *
 * @example
 *     getRelativeTime("2024-01-15 10:00") // "2 hours ago"
 *
 * @param time - UTC datetime string in {@link datetimeFormat}.
 * @param locale - Defaults to the library locale.
 * @param now - Reference instant; defaults to the current instant.
 * @throws {RangeError} If `time` does not match {@link datetimeFormat}.
 */
export const getRelativeTime = (time: string, locale?: string, now?: Temporal.Instant): string => {
    const dateTime = parseUtcDateTime(time)
    if (dateTime === undefined) throw new RangeError(`"${time}" does not match "${datetimeFormat}"`)

    return formatRelativeTime(dateTime.withTimeZone(Temporal.Now.timeZoneId()), locale, now)
}
