import dayjs from "dayjs"
import customParseFormat from "dayjs/plugin/customParseFormat.js"
import utc from "dayjs/plugin/utc.js"

import { serverMaintenanceHour } from "./constants.js"

dayjs.extend(customParseFormat)
dayjs.extend(utc)

/**
 * Gets the server start datetime for a given day offset.
 * The server "day" starts at serverMaintenanceHour UTC.
 *
 * @param dayOffset - Offset from current server day (0 = current, -1 = previous, 1 = next).
 * @returns The server start datetime.
 *
 * @example
 * // If current time is 2024-01-15 08:00 UTC (before 10:00)
 * getServerStartDateTime(0)  // Returns 2024-01-14 10:00 (current server day)
 * getServerStartDateTime(-1) // Returns 2024-01-13 10:00 (previous server day)
 * getServerStartDateTime(1)  // Returns 2024-01-15 10:00 (next server day)
 */
const getServerStartDateTime = (dayOffset: number): dayjs.Dayjs => {
    const now = dayjs().utc()

    // Start with today's maintenance hour
    let serverStart = now.hour(serverMaintenanceHour).minute(0).second(0).millisecond(0)

    // If we're before maintenance hour, current server day started yesterday
    if (now.isBefore(serverStart)) {
        serverStart = serverStart.subtract(1, "day")
    }

    // Apply the requested offset
    if (dayOffset !== 0) {
        serverStart = serverStart.add(dayOffset, "day")
    }

    return serverStart
}

/**
 * Get current server start (date and time).
 * This is the most recent maintenance time that has passed.
 */
export const getCurrentServerStart = (): dayjs.Dayjs => getServerStartDateTime(0)

/**
 * Get previous server start (date and time).
 */
export const getPreviousServerStart = (): dayjs.Dayjs => getServerStartDateTime(-1)

/**
 * Get next server start (date and time).
 */
export const getNextServerStart = (): dayjs.Dayjs => getServerStartDateTime(1)

/**
 * Current server start datetime formatted as "YYYY-MM-DD HH:mm".
 */
export const currentServerStartDateTime = getCurrentServerStart().format("YYYY-MM-DD HH:mm")

/**
 * Current server start date formatted as "YYYY-MM-DD".
 */
export const currentServerStartDate = getCurrentServerStart().format("YYYY-MM-DD")

/**
 * Previous server start date formatted as "YYYY-MM-DD".
 */
export const previousServerStartDate = getPreviousServerStart().format("YYYY-MM-DD")

/**
 * Current server date year as a string.
 */
export const currentServerDateYear = String(getCurrentServerStart().year())

/**
 * Current server date month as a zero-padded string (01-12).
 */
export const currentServerDateMonth = String(getCurrentServerStart().month() + 1).padStart(2, "0")
