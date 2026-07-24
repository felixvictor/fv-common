import { nyseEarlyCloseDataKnownThroughYear, nyseEarlyCloseDates } from "@/trading/nyse-early-close-dates"
import { nyseHolidayDataKnownThroughYear, nyseHolidayDates } from "@/trading/nyse-holiday-dates"

const tzNewYork = "America/New_York"
const weekendNewYork = new Set([6, 7])

export const getNyCalendar = (instant: Temporal.Instant) => {
    const nyDateTime = instant.toZonedDateTimeISO(tzNewYork)

    return {
        nyDate: nyDateTime.toPlainDate(),
        nyTime: nyDateTime.toPlainTime(),
    }
}

const getNyDate = (instant: Temporal.Instant): Temporal.PlainDate => getNyCalendar(instant).nyDate

const isNyseClosedAtDate = (plainDate: Temporal.PlainDate): boolean => nyseHolidayDates.has(plainDate.toString())

export const isNyseOpenAtDate = (nyDate: Temporal.PlainDate): boolean =>
    !(weekendNewYork.has(nyDate.dayOfWeek) || isNyseClosedAtDate(nyDate))

/** Whether `instant` falls on an actual US trading day - New York local calendar date. */
export const isNyseTradingDay = (instant: Temporal.Instant = Temporal.Now.instant()): boolean =>
    isNyseOpenAtDate(getNyDate(instant))

/**
 * The current US trading day as `YYYY-MM-DD` (New York local time).
 * Weekends and NYSE holidays roll forward to the next actual trading day.
 */
export const getNyseTradingDay = (instant: Temporal.Instant = Temporal.Now.instant()): string => {
    let nyDate = getNyDate(instant)

    while (!isNyseOpenAtDate(nyDate)) {
        nyDate = nyDate.add({ days: 1 })
    }

    return nyDate.toString()
}

/**
 * The NY trading day `tradingDaysToAdd` actual trading days after `tradingDay`.
 * Weekends and NYSE holidays don't count toward the offset.
 */
export const addNyseTradingDays = (tradingDay: string, tradingDaysToAdd: number): string => {
    let result = Temporal.PlainDate.from(tradingDay)
    let remainingDays = tradingDaysToAdd

    while (remainingDays > 0) {
        result = result.add({ days: 1 })
        if (isNyseOpenAtDate(result)) {
            remainingDays -= 1
        }
    }

    return result.toString()
}

/** Whether `nyDate` is a documented NYSE early-close day. */
export const isNyseEarlyCloseDay = (nyDate: Temporal.PlainDate): boolean => nyseEarlyCloseDates.has(nyDate.toString())

/** True once `nyDate`'s year has no early-close data. Callers with a Logger should warn on this. */
export const isNyseEarlyCloseDataStale = (nyDate: Temporal.PlainDate): boolean =>
    nyDate.year > nyseEarlyCloseDataKnownThroughYear

/** True once `nyDate`'s year has no holiday data. Callers with a Logger should warn on this. */
export const isNyseHolidayDataStale = (nyDate: Temporal.PlainDate): boolean =>
    nyDate.year > nyseHolidayDataKnownThroughYear

/** True if either calendar has no data for `nyDate`'s year. */
export const isNyseCalendarDataStale = (nyDate: Temporal.PlainDate): boolean =>
    isNyseHolidayDataStale(nyDate) || isNyseEarlyCloseDataStale(nyDate)
