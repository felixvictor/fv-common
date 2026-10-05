/**
 * Conversions between .NET `DateTime` ticks and Temporal instants.
 *
 * A tick is 100 nanoseconds; .NET counts ticks from 0001-01-01T00:00:00Z.
 */
import { datetimeFormat, utcTimeZone } from "@/temporal/constants"
import { formatPattern } from "@/temporal/pattern"

/** Ticks between the .NET epoch (0001-01-01) and the Unix epoch (1970-01-01): 719,162 days × 864,000,000,000. */
const dotNetEpochTicks = 621_355_968_000_000_000n

const ticksPerMillisecond = 10_000n

const nanosecondsPerTick = 100n

/** .NET ticks as `bigint`, number or decimal string. */
export type TicksInput = bigint | number | string

/**
 * Converts .NET ticks to Unix epoch milliseconds (truncated).
 *
 * @example
 *     new Date(getTimestampFromTicks(638_400_000_000_000_000n))
 */
export const getTimestampFromTicks = (ticks: TicksInput): number =>
    Number((BigInt(ticks) - dotNetEpochTicks) / ticksPerMillisecond)

/** Converts .NET ticks to an instant with full tick precision. */
export const getInstantFromTicks = (ticks: TicksInput): Temporal.Instant =>
    Temporal.Instant.fromEpochNanoseconds((BigInt(ticks) - dotNetEpochTicks) * nanosecondsPerTick)

/**
 * Converts .NET ticks to a UTC datetime string.
 *
 * @example
 *     getTimeFromTicks(638_400_000_000_000_000n) // "2024-01-04 16:00"
 *
 * @returns UTC datetime string in {@link datetimeFormat}.
 */
export const getTimeFromTicks = (ticks: TicksInput): string =>
    formatPattern(
        Temporal.Instant.fromEpochMilliseconds(getTimestampFromTicks(ticks)).toZonedDateTimeISO(utcTimeZone),
        datetimeFormat,
    )

/**
 * Converts a point in time to .NET ticks. Instants keep their sub-millisecond part.
 *
 * @param date - `Temporal.Instant`, `Date` or Unix epoch milliseconds.
 */
export const getTicksFromDate = (date: Date | number | Temporal.Instant): bigint => {
    if (date instanceof Temporal.Instant) return date.epochNanoseconds / nanosecondsPerTick + dotNetEpochTicks

    const milliseconds = typeof date === "number" ? date : date.getTime()
    return BigInt(milliseconds) * ticksPerMillisecond + dotNetEpochTicks
}
