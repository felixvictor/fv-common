export const addToInstant = (instant: Temporal.Instant, duration: Temporal.DurationLike) =>
    instant.toZonedDateTimeISO("UTC").add(duration).toInstant()

export const subtractFromInstant = (instant: Temporal.Instant, duration: Temporal.DurationLike) =>
    instant.toZonedDateTimeISO("UTC").subtract(duration).toInstant()
