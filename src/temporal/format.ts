import { getLocale } from "@/locale"
import { dateToString } from "@/temporal/convert"

const locale = getLocale()

const durationFormatOptions: Intl.DurationFormatOptions = {
    style: "long",
}
const timeFormatOptions: Intl.DateTimeFormatOptions = {
    dateStyle: "short",
    timeStyle: "short",
}

export const formatMs = (ms: number, locale?: string): string => {
    const effectiveLocale = locale ?? getLocale()
    const duration = Temporal.Duration.from({ milliseconds: ms }).round({
        largestUnit: "hour",
        relativeTo: Temporal.Now.zonedDateTimeISO(),
    })

    // Built per call
    const timeFormatter = new Intl.DurationFormat(effectiveLocale, durationFormatOptions)

    return timeFormatter.format(duration)
}

const timeOptions: Intl.DateTimeFormatOptions = { hour: "numeric", hourCycle: "h23", minute: "numeric" }

export const formatPlainTime = (time: Temporal.PlainTime, locale?: string): string => {
    const effectiveLocale = locale ?? getLocale()
    const formatter = new Intl.DateTimeFormat(effectiveLocale, timeOptions)

    return formatter
        .formatToParts(time)
        .map((part) => (part.type === "hour" ? String(Number(part.value)) : part.value))
        .join("")
}

export const formatDate = (date: Date): string => Temporal.PlainDate.from(dateToString(date)).toLocaleString(locale)

export const formatDateString = (dateString: string): string =>
    Temporal.PlainDate.from(dateString).toLocaleString(locale)

export const formatDuration = (duration: Temporal.Duration): string =>
    duration.toLocaleString(locale, durationFormatOptions)

export const formatInstant = (instant: Temporal.Instant): string => instant.toLocaleString(locale, timeFormatOptions)
