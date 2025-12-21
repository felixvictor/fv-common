import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"

dayjs.extend(utc)

/**
 * The .NET DateTime epoch in ticks (January 1, 0001 00:00:00 UTC).
 * .NET ticks are 100-nanosecond intervals since this epoch.
 * This value represents the number of ticks between .NET epoch and Unix epoch.
 *
 * Calculation:
 * - Unix epoch: January 1, 1970 00:00:00 UTC
 * - .NET epoch: January 1, 0001 00:00:00 UTC
 * - Time difference: 1969 years, 365.2425 days/year average (accounting for leap years)
 * - Days between epochs: 719,162 days
 * - In 100-nanosecond ticks: 719,162 days × 24 hours × 60 min × 60 sec × 10,000,000 ticks/sec
 * - Result: 621,355,968,000,000,000 ticks
 */
const dotNetEpochTicks = 621_355_968_000_000_000n

/**
 * Number of ticks per millisecond in .NET DateTime.
 *
 * Calculation:
 * - 1 tick = 100 nanoseconds (defined by .NET)
 * - 1 millisecond = 1,000,000 nanoseconds
 * - Therefore: 1,000,000 ÷ 100 = 10,000 ticks per millisecond
 */
const ticksPerMillisecond = 10_000n

/**
 * Converts .NET DateTime ticks to a formatted date-time string.
 *
 * @param ticks - The time in .NET ticks (100-nanosecond intervals since 0001-01-01).
 * @returns Formatted date-time string in UTC (YYYY-MM-DD HH:mm).
 *
 * @example
 * // Convert .NET DateTime.Now.Ticks to readable format
 * getTimeFromTicks(638400000000000000) // "2024-01-15 10:30"
 */
export const getTimeFromTicks = (ticks: bigint | number | string): string => {
    const milliseconds = getTimestampFromTicks(ticks)
    return dayjs.utc(milliseconds).format("YYYY-MM-DD HH:mm")
}

/**
 * Converts .NET DateTime ticks to a Day.js object.
 *
 * @param ticks - The time in .NET ticks (100-nanosecond intervals since 0001-01-01).
 * @returns A Day.js object in UTC.
 *
 * @example
 * const date = getDateFromTicks(638400000000000000)
 * console.log(date.format("YYYY-MM-DD"))
 */
export const getDateFromTicks = (ticks: bigint | number): dayjs.Dayjs => {
    const ticksBI = BigInt(ticks)

    const millisecondsBI = (ticksBI - dotNetEpochTicks) / ticksPerMillisecond

    return dayjs.utc(Number(millisecondsBI))
}

/**
 * Converts a Day.js object or timestamp to .NET DateTime ticks.
 *
 * @param date - A Day.js object or Unix timestamp in milliseconds.
 * @returns The time in .NET ticks.
 *
 * @example
 * const ticks = getTicksFromDate(dayjs())
 * const ticks2 = getTicksFromDate(Date.now())
 */
export const getTicksFromDate = (date: dayjs.Dayjs | number): bigint => {
    const millisecondsBI = BigInt(typeof date === "number" ? date : date.valueOf())

    return millisecondsBI * ticksPerMillisecond + dotNetEpochTicks
}

/**
 * Converts .NET DateTime ticks to a Unix timestamp in milliseconds.
 *
 * @param ticks - The time in .NET ticks (100-nanosecond intervals since 0001-01-01).
 * @returns Unix timestamp in milliseconds.
 *
 * @example
 * const timestamp = getTimestampFromTicks(638400000000000000)
 * const date = new Date(timestamp)
 */
export const getTimestampFromTicks = (ticks: bigint | number | string): number => {
    const ticksBI = BigInt(ticks)
    const millisecondsBI = (ticksBI - dotNetEpochTicks) / ticksPerMillisecond
    return Number(millisecondsBI)
}
