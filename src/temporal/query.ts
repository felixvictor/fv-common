import { parseInstant } from "@/temporal/convert"

export const daysBetweenInstants = (start: Temporal.Instant, end: Temporal.Instant): number =>
    start.toZonedDateTimeISO("UTC").until(end.toZonedDateTimeISO("UTC"), { largestUnit: "days" }).days

export const getMidnightUTC = (dateString: string): Temporal.ZonedDateTime =>
    Temporal.PlainDate.from(dateString).toZonedDateTime("UTC")

export const hoursBetweenInstants = (start: Temporal.Instant, end: Temporal.Instant): number =>
    start.toZonedDateTimeISO("UTC").until(end.toZonedDateTimeISO("UTC"), { largestUnit: "hours" }).hours

/**
 * Finds the date string closest to `now`. Ties resolve to the first candidate; unparsable entries are skipped.
 *
 * @param datesString - ISO 8601 strings; without offset they are read as system time.
 * @param now - Reference instant; defaults to the current instant.
 * @returns Index of the closest date, or undefined if no entry can be parsed.
 */
export const closestDateIndex = (
    datesString: readonly string[],
    now: Temporal.Instant = Temporal.Now.instant(),
): number | undefined => {
    let closestIndex: number | undefined
    let closestDistance = Number.POSITIVE_INFINITY

    for (const [index, dateString] of datesString.entries()) {
        const instant = parseInstant(dateString)
        if (instant === undefined) continue

        const distance = Math.abs(instant.epochMilliseconds - now.epochMilliseconds)
        if (distance < closestDistance) {
            closestDistance = distance
            closestIndex = index
        }
    }

    return closestIndex
}
