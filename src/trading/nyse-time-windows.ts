import type { PlainTimeWindow, TimeWindow } from "@/trading/nyse-time-windows.interface"

import { formatPlainTime, isTimeBetween } from "@/temporal/common"
import { getNyCalendar, isNyseEarlyCloseDay, isNyseOpenAtDate } from "@/trading/nyse-date"
import { nyseEarlyCloseAfterHoursEndTime, nyseEarlyCloseTime } from "@/trading/nyse-early-close-dates"

export type NyseTimeWindowKey = keyof typeof windows

const nyseRegularSessionOpenTime = Temporal.PlainTime.from({ hour: 9, minute: 30 })
const nyseRegularSessionDefaultCloseTime = Temporal.PlainTime.from({ hour: 16, minute: 0 })
const nyseTradingDayStartTime = Temporal.PlainTime.from({ hour: 4, minute: 0 })
const nyseExtendedSessionDefaultCloseTime = Temporal.PlainTime.from({ hour: 20, minute: 0 })
const edgarOperatingStartTime = Temporal.PlainTime.from({ hour: 6, minute: 0 })
const edgarOperatingEndTime = Temporal.PlainTime.from({ hour: 22, minute: 30 })

const windows = {
    isEdgarOperating: {
        order: 4,
        text: "SEC edgar filing",
        window: {
            end: edgarOperatingEndTime,
            start: edgarOperatingStartTime,
        },
    },
    isNyseExtendedTradingHours: {
        order: 3,
        text: "Extended trading hours",
        window: {
            end: { default: nyseExtendedSessionDefaultCloseTime, earlyClose: nyseEarlyCloseAfterHoursEndTime },
            start: nyseTradingDayStartTime,
        },
    },
    isNyseMarketHours: {
        order: 1,
        text: "Regular market hours",
        window: {
            end: { default: nyseRegularSessionDefaultCloseTime, earlyClose: nyseEarlyCloseTime },
            start: nyseRegularSessionOpenTime,
        },
    },
    isNysePreMarket: {
        order: 2,
        text: "Pre-market",
        window: {
            end: nyseRegularSessionOpenTime,
            start: nyseTradingDayStartTime,
        },
    },
} as const

const resolveEnd = (end: PlainTimeWindow["end"], nyDate: Temporal.PlainDate): Temporal.PlainTime => {
    if (end instanceof Temporal.PlainTime) {
        return end
    }
    return isNyseEarlyCloseDay(nyDate) ? end.earlyClose : end.default
}

const describeWindow = (window: PlainTimeWindow, instant: Temporal.Instant): string => {
    const { nyDate } = getNyCalendar(instant)
    return `${formatPlainTime(window.start)} to ${formatPlainTime(resolveEnd(window.end, nyDate))}`
}

export const nyseTimeWindows: Record<string, TimeWindow> = Object.fromEntries(
    Object.entries(windows).map(([key, val]) => [
        key,
        {
            ...val,
            info: (instant: Temporal.Instant = Temporal.Now.instant()) => describeWindow(val.window, instant),
        },
    ]),
)

const isNyTimeBetween = (instant: Temporal.Instant, timeWindow: PlainTimeWindow) => {
    const { nyDate, nyTime } = getNyCalendar(instant)

    if (!isNyseOpenAtDate(nyDate)) return false
    return isTimeBetween(nyTime, timeWindow.start, resolveEnd(timeWindow.end, nyDate))
}

const nyseTimeWindowChecks = Object.fromEntries(
    Object.entries(nyseTimeWindows).map(([key, timeWindow]) => [
        key,
        (instant: Temporal.Instant = Temporal.Now.instant()) => isNyTimeBetween(instant, timeWindow.window),
    ]),
) as Record<NyseTimeWindowKey, (instant?: Temporal.Instant) => boolean>

export const { isEdgarOperating, isNyseExtendedTradingHours, isNyseMarketHours, isNysePreMarket } = nyseTimeWindowChecks

export const nyseStatus = (): Record<NyseTimeWindowKey, boolean> =>
    Object.fromEntries(Object.entries(nyseTimeWindowChecks).map(([key, check]) => [key, check()])) as Record<
        NyseTimeWindowKey,
        boolean
    >
