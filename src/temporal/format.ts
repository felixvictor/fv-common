import { getLocale } from "@/locale"
import { dateToString } from "@/temporal/convert"

const durationFormatOptions: Intl.DurationFormatOptions = {
    style: "long",
}
const dateTimeFormatOptions: Intl.DateTimeFormatOptions = {
    dateStyle: "short",
    timeStyle: "short",
}

export const formatMs = (ms: number, options = durationFormatOptions, locale?: string): string => {
    const effectiveLocale = locale ?? getLocale()
    const duration = Temporal.Duration.from({ milliseconds: ms }).round({
        largestUnit: "hour",
        relativeTo: Temporal.Now.zonedDateTimeISO(),
    })

    // Built per call
    const timeFormatter = new Intl.DurationFormat(effectiveLocale, options)

    return timeFormatter.format(duration)
}

const timeOptions: Intl.DateTimeFormatOptions = { hour: "numeric", hourCycle: "h23", minute: "numeric" }

export const formatPlainTime = (time: Temporal.PlainTime, options = timeOptions, locale?: string): string => {
    const effectiveLocale = locale ?? getLocale()
    const formatter = new Intl.DateTimeFormat(effectiveLocale, options)

    return formatter
        .formatToParts(time)
        .map((part) => (part.type === "hour" ? String(Number(part.value)) : part.value))
        .join("")
}

export const formatDate = (date: Date, options = durationFormatOptions, locale?: string): string => {
    const effectiveLocale = locale ?? getLocale()
    return Temporal.PlainDate.from(dateToString(date)).toLocaleString(effectiveLocale, options)
}

export const formatDateString = (dateString: string, options = durationFormatOptions, locale?: string): string => {
    const effectiveLocale = locale ?? getLocale()
    return Temporal.PlainDate.from(dateString).toLocaleString(effectiveLocale, options)
}

export const formatDuration = (
    duration: Temporal.Duration,
    options = durationFormatOptions,
    locale?: string,
): string => {
    const effectiveLocale = locale ?? getLocale()
    return duration.toLocaleString(effectiveLocale, options)
}

export const formatInstant = (instant: Temporal.Instant, options = dateTimeFormatOptions, locale?: string): string => {
    const effectiveLocale = locale ?? getLocale()
    return instant.toLocaleString(effectiveLocale, options)
}
