/**
 * Server days. A server day starts at {@link serverMaintenanceHour}:00 UTC.
 *
 * The exported date strings are computed when the module is loaded.
 */
import { datetimeFormat, utcTimeZone } from "@/temporal/constants"
import { formatPattern } from "@/temporal/pattern"

import { serverMaintenanceHour } from "./constants.js"

const twoDigits = 2

/**
 * Start of the server day `dayOffset` days away from the current one.
 *
 * @example
 *     // At 2024-01-15T08:00Z, before maintenance
 *     getServerStart(0) // 2024-01-14T10:00Z, current server day
 *     getServerStart(-1) // 2024-01-13T10:00Z
 *     getServerStart(1) // 2024-01-15T10:00Z
 *
 * @param dayOffset - 0 for the current server day, -1 for the previous one, 1 for the next one.
 * @param now - Reference instant; defaults to the current instant.
 * @returns Start of the server day in UTC.
 */
export const getServerStart = (
    dayOffset: number,
    now: Temporal.Instant = Temporal.Now.instant(),
): Temporal.ZonedDateTime => {
    const zonedNow = now.toZonedDateTimeISO(utcTimeZone)
    const todaysStart = zonedNow.withPlainTime({ hour: serverMaintenanceHour })
    const isBeforeMaintenance = Temporal.ZonedDateTime.compare(zonedNow, todaysStart) < 0
    const currentStart = isBeforeMaintenance ? todaysStart.subtract({ days: 1 }) : todaysStart

    return currentStart.add({ days: dayOffset })
}

/** Start of the current server day in UTC, i.e. the most recent maintenance time. */
export const getCurrentServerStart = (now?: Temporal.Instant): Temporal.ZonedDateTime => getServerStart(0, now)

/** Start of the previous server day in UTC. */
export const getPreviousServerStart = (now?: Temporal.Instant): Temporal.ZonedDateTime => getServerStart(-1, now)

/** Start of the next server day in UTC. */
export const getNextServerStart = (now?: Temporal.Instant): Temporal.ZonedDateTime => getServerStart(1, now)

const currentServerStart = getCurrentServerStart()

/** Start of the current server day as `YYYY-MM-DD HH:mm` (UTC). */
export const currentServerStartDateTime = formatPattern(currentServerStart, datetimeFormat)

/** Date of the current server day as `YYYY-MM-DD`. */
export const currentServerStartDate = currentServerStart.toPlainDate().toString()

/** Date of the previous server day as `YYYY-MM-DD`. */
export const previousServerStartDate = currentServerStart.subtract({ days: 1 }).toPlainDate().toString()

/** Year of the current server day. */
export const currentServerDateYear = String(currentServerStart.year)

/** Month of the current server day, zero-padded (01–12). */
export const currentServerDateMonth = String(currentServerStart.month).padStart(twoDigits, "0")
