import { formatTimeRange } from "../date/date.js"
import { hoursPerDay, maxPortBattleHour, serverMaintenanceHour } from "./constants.js"

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
