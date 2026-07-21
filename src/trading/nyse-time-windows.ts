import type { PlainTimeWindow, TimeWindow } from "@/trading/nyse-time-windows.interface"

import { formatPlainTime, isTimeBetween } from "@/temporal/common"
import { getNyCalendar, isNyseOpenAtDate } from "@/trading/nyse-date"

export type NyseTimeWindowKey = keyof typeof windows

const windows = {
    isEdgarOperating: {
        order: 4,
        text: "SEC Edgar filing",
        window: {
            end: Temporal.PlainTime.from({ hour: 22, minute: 30 }),
            start: Temporal.PlainTime.from({ hour: 6, minute: 0 }),
        },
    },
    isNyseExtendedTradingHours: {
        order: 3,
        text: "Extended trading hours",
        window: {
            end: Temporal.PlainTime.from({ hour: 20, minute: 0 }),
            start: Temporal.PlainTime.from({ hour: 4, minute: 0 }),
        },
    },
    isNyseMarketHours: {
        order: 1,
        text: "Regular market hours",
        window: {
            end: Temporal.PlainTime.from({ hour: 16, minute: 0 }),
            start: Temporal.PlainTime.from({ hour: 9, minute: 30 }),
        },
    },
    isNysePreMarket: {
        order: 2,
        text: "Pre-market",
        window: {
            end: Temporal.PlainTime.from({ hour: 9, minute: 30 }),
            start: Temporal.PlainTime.from({ hour: 4, minute: 0 }),
        },
    },
} as const

export const nyseTimeWindows: Record<string, TimeWindow> = Object.fromEntries(
    Object.entries(windows).map(([key, val]) => [
        key,
        {
            ...val,
            info: `${formatPlainTime(val.window.start)} to ${formatPlainTime(val.window.end)}`,
        },
    ]),
) as Record<NyseTimeWindowKey, TimeWindow>

const isNyTimeBetween = (instant: Temporal.Instant, timeWindow: PlainTimeWindow) => {
    const { nyDate, nyTime } = getNyCalendar(instant)

    if (!isNyseOpenAtDate(nyDate)) return false

    return isTimeBetween(nyTime, timeWindow.start, timeWindow.end)
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
