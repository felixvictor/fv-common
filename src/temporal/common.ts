import { getLocale } from "@/locale"

export const isTimeBetween = (time: Temporal.PlainTime, start: Temporal.PlainTime, end: Temporal.PlainTime): boolean =>
    Temporal.PlainTime.compare(time, start) >= 0 && Temporal.PlainTime.compare(time, end) < 0

const durationStyle: Intl.DurationFormatOptions = { style: "long" }
export const formatMs = (ms: number, locale?: string): string => {
    const effectiveLocale = locale ?? getLocale()
    const duration = Temporal.Duration.from({ milliseconds: ms }).round({
        largestUnit: "hour",
        relativeTo: Temporal.Now.zonedDateTimeISO(),
    })

    // Built per call
    const timeFormatter = new Intl.DurationFormat(effectiveLocale, durationStyle)

    return timeFormatter.format(duration)
}

const timeOptions: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "numeric" }
export const formatPlainTime = (time: Temporal.PlainTime, locale?: string): string => {
    const effectiveLocale = locale ?? getLocale()
    return time.toLocaleString(effectiveLocale, timeOptions)
}
