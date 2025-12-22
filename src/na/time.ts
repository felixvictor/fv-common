import dayjs from "dayjs"
import "dayjs/locale/de"
import "dayjs/locale/en"
import "dayjs/locale/en-gb"
import utc from "dayjs/plugin/utc"

import { formatTimeRange } from "../date/date.js"
import { getLocale, onLocaleChange, setLocale as setLibraryLocale } from "../locale.js"
import { hoursPerDay, maxPortBattleHour, serverMaintenanceHour } from "./constants.js"

dayjs.extend(utc)

// Wrapper to sync dayjs locale with library locale
export const setDateLocale = (locale: string): void => {
    setLibraryLocale(locale)
    dayjs.locale(locale)
}

// Sync dayjs locale on any locale changes
onLocaleChange(() => {
    dayjs.locale(getLocale())
})

// Initialise with default
setDateLocale("en-GB")

/**
 * Calculates and formats the port battle time window.
 *
 * @param startHoursFromSMH - Hours offset from server maintenance hour.
 * @param isNeutralPort - Whether this is a neutral port (9h window vs 2h).
 * @returns Formatted time range string with UTC and local times.
 *
 * @example
 * getPortBattleTime(0, false) // "10 – 8 (14 – 12 local)" (if local is UTC+4)
 * getPortBattleTime(2, true)  // "12 – 21 (16 – 1 local)" (9-hour neutral port window)
 */
export const getPortBattleTime = (startHoursFromSMH: number, isNeutralPort = false): string => {
    const durationInHours = isNeutralPort ? 9 : 2
    const startTime = (serverMaintenanceHour + startHoursFromSMH) % hoursPerDay

    let endTime = serverMaintenanceHour + startHoursFromSMH + durationInHours
    if (endTime > hoursPerDay) {
        endTime = Math.min(
            (serverMaintenanceHour + startHoursFromSMH + durationInHours) % hoursPerDay,
            maxPortBattleHour,
        )
    }

    return startHoursFromSMH === 0
        ? formatTimeRange(serverMaintenanceHour, maxPortBattleHour)
        : formatTimeRange(startTime, endTime)
}

export const getToday = () => {
    const now = dayjs.utc()
    let begin = dayjs().utc().hour(serverMaintenanceHour).minute(0)
    if (now.hour() < begin.hour()) {
        begin = begin.subtract(1, "day")
    }

    const end = begin.add(1, "day")

    return { begin, end }
}

export const getYesterday = () => {
    const now = dayjs.utc()
    let begin = now.hour(serverMaintenanceHour).minute(0).subtract(1, "day")
    if (now.hour() < begin.hour()) {
        begin = begin.subtract(1, "day")
    }

    const end = begin.add(1, "day")

    return { begin, end }
}

export const getThisWeek = () => {
    const currentMondayOfWeek = dayjs().utc().startOf("week")
    // This Monday
    const begin = currentMondayOfWeek.hour(serverMaintenanceHour)
    // Next Monday
    const end = currentMondayOfWeek.add(7, "day").hour(serverMaintenanceHour)

    return { begin, end }
}

export const getLastWeek = () => {
    const currentMondayOfWeek = dayjs().utc().startOf("week")
    // Monday last week
    const begin = currentMondayOfWeek.subtract(7, "day").hour(serverMaintenanceHour)
    // This Monday
    const end = currentMondayOfWeek.hour(serverMaintenanceHour)

    return { begin, end }
}
