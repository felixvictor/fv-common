export const daysBetweenInstants = (start: Temporal.Instant, end: Temporal.Instant): number =>
    start.toZonedDateTimeISO("UTC").until(end.toZonedDateTimeISO("UTC"), { largestUnit: "days" }).days

export const getMidnightUTC = (dateString: string): Temporal.ZonedDateTime =>
    Temporal.PlainDate.from(dateString).toZonedDateTime("UTC")

export const hoursBetweenInstants = (start: Temporal.Instant, end: Temporal.Instant): number =>
    start.toZonedDateTimeISO("UTC").until(end.toZonedDateTimeISO("UTC"), { largestUnit: "hours" }).hours
