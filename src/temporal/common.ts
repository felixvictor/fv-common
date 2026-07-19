import { getLocale } from "@/locale"

export const isTimeBetween = (time: Temporal.PlainTime, start: Temporal.PlainTime, end: Temporal.PlainTime): boolean =>
    Temporal.PlainTime.compare(time, start) >= 0 && Temporal.PlainTime.compare(time, end) < 0

export const formatMs = (ms: number): string => {
    const duration = Temporal.Duration.from({ milliseconds: ms }).round({
        largestUnit: "hour",
        relativeTo: Temporal.Now.zonedDateTimeISO(),
    })

    // Built per call, not at module scope - a module-level formatter would
    // freeze on whatever locale is set at import time, before main.ts's
    // setLocale() call runs.
    const timeFormatter = new Intl.DurationFormat(getLocale(), { style: "long" })

    return timeFormatter.format(duration)
}
