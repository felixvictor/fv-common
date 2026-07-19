import { isHoliday } from "nyse-holidays"
import { isTimeBetween } from "@/temporal/common"

const tzNewYork = "America/New_York"
const localeUS = new Intl.Locale("en-US")
const { weekend } = localeUS.getWeekInfo()

const preMarketStart = Temporal.PlainTime.from({ hour: 4, minute: 0 })
const preMarketEnd = Temporal.PlainTime.from({ hour: 9, minute: 30 })

const extendedHoursStart = Temporal.PlainTime.from({ hour: 4, minute: 0 })
const extendedHoursEnd = Temporal.PlainTime.from({ hour: 20, minute: 0 })

// SEC-documented EDGAR submission window: https://www.sec.gov/submit-filings
// ("EDGAR is available to accept filings from 6 a.m. to 10 p.m. ET
// weekdays (except federal holidays). Filings made outside of these times
// are processed the next business day.") End extended by a 30-minute
// trailing buffer past the 22:00 submission cutoff: per SEC's own FAQ
// (https://www.sec.gov/about/webmaster-frequently-asked-questions#lag),
// "Filings are often available on sec.gov within 1-3 minutes of the
// EDGAR system timestamp. The lag time can increase significantly with
// high server load" - 30 minutes covers the typical case with wide
// margin plus most high-load outliers. No buffer before 06:00: nothing
// can have been submitted before EDGAR opens, so there's nothing to catch.
const edgarOperatingStart = Temporal.PlainTime.from({ hour: 6, minute: 0 })
const edgarOperatingEnd = Temporal.PlainTime.from({ hour: 22, minute: 30 })

const getNyCalendar = (instant: Temporal.Instant) => {
    const nyDateTime = instant.toZonedDateTimeISO(tzNewYork)
    return {
        nyDate: nyDateTime.toPlainDate(),
        nyTime: nyDateTime.toPlainTime(),
    }
}

const getNyDate = (instant: Temporal.Instant): Temporal.PlainDate => getNyCalendar(instant).nyDate

const isNyseClosed = (plainDate: Temporal.PlainDate): boolean => {
    const jsDate = new Date(plainDate.year, plainDate.month - 1, plainDate.day)
    return isHoliday(jsDate)
}

const isNyseOpen = (nyDate: Temporal.PlainDate): boolean =>
    !(weekend.includes(nyDate.dayOfWeek) || isNyseClosed(nyDate))

/**
 * Whether the given moment falls on an actual US trading day (not a
 * weekend, not an NYSE holiday) - New York local calendar date.
 */
export const isNyseTradingDay = (instant: Temporal.Instant = Temporal.Now.instant()): boolean =>
    isNyseOpen(getNyDate(instant))

/**
 * Returns the current US trading day as `YYYY-MM-DD` (New York local time),
 * regardless of which time zone the server process itself runs in.
 * Weekends and NYSE holidays are rolled forward to the next actual
 * trading day - e.g. a Saturday instant resolves to the following Monday
 * (or later, if that Monday is itself a holiday).
 */
export const getNyseTradingDay = (instant: Temporal.Instant = Temporal.Now.instant()): string => {
    let nyDate = getNyDate(instant)

    // Weekend filings or NYSE holidays are attributed to the next actual trading day.
    while (!isNyseOpen(nyDate)) {
        nyDate = nyDate.add({ days: 1 })
    }

    return nyDate.toString()
}

const isNyTimeBetween = (instant: Temporal.Instant, startTime: Temporal.PlainTime, endTime: Temporal.PlainTime) => {
    const { nyDate, nyTime } = getNyCalendar(instant)

    if (!isNyseOpen(nyDate)) return false

    return isTimeBetween(nyTime, startTime, endTime)
}

/**
 * Determines whether the given moment falls within the NYSE's pre-market
 * session (04:00-09:30 New York time) on an actual trading day. Always
 * false on weekends and NYSE holidays, regardless of time of day.
 */
export const isNysePreMarket = (instant: Temporal.Instant = Temporal.Now.instant()): boolean =>
    isNyTimeBetween(instant, preMarketStart, preMarketEnd)

/**
 * Whether IBKR is likely to have any market data to report at all — pre-
 * market through after-hours (04:00-20:00 New York time) on an actual
 * trading day. Broader than `isPreMarket`; use this for anything that
 * just needs "is there data to fetch right now", not specifically the
 * pre-market scan window.
 */
export const isNyseExtendedTradingHours = (instant: Temporal.Instant = Temporal.Now.instant()): boolean =>
    isNyTimeBetween(instant, extendedHoursStart, extendedHoursEnd)

/**
 * Whether EDGAR is likely accepting/disseminating new filings right now:
 * weekdays, 06:00-22:00 New York time (plus 30-minute trailing buffer).
 */
export const isEdgarOperating = (instant: Temporal.Instant = Temporal.Now.instant()): boolean =>
    isNyTimeBetween(instant, edgarOperatingStart, edgarOperatingEnd)

/**
 * Returns the NY trading day that is `tradingDaysToAdd` actual trading
 * days after `day` — weekends and NYSE holidays don't count toward the
 * offset, so "1 trading day after a Friday" resolves to the following
 * Monday (or later, if that Monday is itself a holiday).
 */
export const addNyseTradingDays = (tradingDay: string, tradingDaysToAdd: number): string => {
    let result = Temporal.PlainDate.from(tradingDay)
    let remainingDays = tradingDaysToAdd

    while (remainingDays > 0) {
        result = result.add({ days: 1 })
        if (isNyseOpen(result)) {
            remainingDays -= 1
        }
    }

    return result.toString()
}
