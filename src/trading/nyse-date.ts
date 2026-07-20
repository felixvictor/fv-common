import { isHoliday } from "nyse-holidays"

const tzNewYork = "America/New_York"
const weekend = new Set([6, 7])

export const getNyCalendar = (instant: Temporal.Instant) => {
    const nyDateTime = instant.toZonedDateTimeISO(tzNewYork)
    return {
        nyDate: nyDateTime.toPlainDate(),
        nyTime: nyDateTime.toPlainTime(),
    }
}

const getNyDate = (instant: Temporal.Instant): Temporal.PlainDate => getNyCalendar(instant).nyDate

const isNyseClosedAtDate = (plainDate: Temporal.PlainDate): boolean => {
    const jsDate = new Date(plainDate.year, plainDate.month - 1, plainDate.day)
    return isHoliday(jsDate)
}

export const isNyseOpenAtDate = (nyDate: Temporal.PlainDate): boolean =>
    !(weekend.has(nyDate.dayOfWeek) || isNyseClosedAtDate(nyDate))

/**
 * Whether the given moment falls on an actual US trading day (not a
 * weekend, not an NYSE holiday) - New York local calendar date.
 */
export const isNyseTradingDay = (instant: Temporal.Instant = Temporal.Now.instant()): boolean =>
    isNyseOpenAtDate(getNyDate(instant))

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
    while (!isNyseOpenAtDate(nyDate)) {
        nyDate = nyDate.add({ days: 1 })
    }

    return nyDate.toString()
}

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
        if (isNyseOpenAtDate(result)) {
            remainingDays -= 1
        }
    }

    return result.toString()
}
