/**
 * Port battle times and server-time periods.
 *
 * Periods start and end at {@link serverMaintenanceHour}:00 UTC; weeks start on Monday.
 */
import { setLocale } from "@/locale"
import { utcTimeZone } from "@/temporal/constants"
import { formatTimeRange } from "@/temporal/format"

import { hoursPerDay, maxPortBattleHour, serverMaintenanceHour } from "./constants.js"
import { getServerStart } from "./server-time.js"

/** Start and end of a server-time period in UTC. */
export interface ServerTimePeriod {
    begin: Temporal.ZonedDateTime
    end: Temporal.ZonedDateTime
}

const portBattleDurationHours = 2
const neutralPortBattleDurationHours = 9

/** @deprecated Use {@link setLocale}. */
export const setDateLocale = setLocale

/**
 * Calculates and formats the port battle time window.
 *
 * @example
 *     getPortBattleTime(0, false, "Asia/Dubai") // "10 – 8 (14 – 12 local)"
 *     getPortBattleTime(2, true, "Asia/Dubai") // "12 – 21 (16 – 1 local)", 9-hour neutral port window
 *
 * @param startHoursFromSMH - Hours offset from server maintenance hour.
 * @param isNeutralPort - Whether this is a neutral port with a 9-hour window; other ports have 2 hours.
 * @param timeZone - Local time zone; defaults to the system time zone.
 * @returns HTML string with the UTC and local hour ranges.
 */
export const getPortBattleTime = (startHoursFromSMH: number, isNeutralPort = false, timeZone?: string): string => {
    const durationInHours = isNeutralPort ? neutralPortBattleDurationHours : portBattleDurationHours
    const startTime = (serverMaintenanceHour + startHoursFromSMH) % hoursPerDay

    let endTime = serverMaintenanceHour + startHoursFromSMH + durationInHours
    if (endTime > hoursPerDay) {
        endTime = Math.min(endTime % hoursPerDay, maxPortBattleHour)
    }

    return startHoursFromSMH === 0
        ? formatTimeRange(serverMaintenanceHour, maxPortBattleHour, timeZone)
        : formatTimeRange(startTime, endTime, timeZone)
}

/** Start of the server week `weekOffset` weeks away from the current one: Monday at the maintenance hour. */
const getWeekStart = (weekOffset: number, now: Temporal.Instant): Temporal.ZonedDateTime => {
    const today = now.toZonedDateTimeISO(utcTimeZone)

    return today
        .subtract({ days: today.dayOfWeek - 1 })
        .add({ weeks: weekOffset })
        .withPlainTime({ hour: serverMaintenanceHour })
}

/**
 * Current server day.
 *
 * @param now - Reference instant; defaults to the current instant.
 */
export const getToday = (now: Temporal.Instant = Temporal.Now.instant()): ServerTimePeriod => {
    const begin = getServerStart(0, now)
    return { begin, end: begin.add({ days: 1 }) }
}

/**
 * Previous server day.
 *
 * @param now - Reference instant; defaults to the current instant.
 */
export const getYesterday = (now: Temporal.Instant = Temporal.Now.instant()): ServerTimePeriod => {
    const end = getServerStart(0, now)
    return { begin: end.subtract({ days: 1 }), end }
}

/**
 * Current week from this Monday to next Monday.
 *
 * @param now - Reference instant; defaults to the current instant.
 */
export const getThisWeek = (now: Temporal.Instant = Temporal.Now.instant()): ServerTimePeriod => ({
    begin: getWeekStart(0, now),
    end: getWeekStart(1, now),
})

/**
 * Previous week from last Monday to this Monday.
 *
 * @param now - Reference instant; defaults to the current instant.
 */
export const getLastWeek = (now: Temporal.Instant = Temporal.Now.instant()): ServerTimePeriod => ({
    begin: getWeekStart(-1, now),
    end: getWeekStart(0, now),
})
