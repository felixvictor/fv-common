export const isTimeBetween = (time: Temporal.PlainTime, start: Temporal.PlainTime, end: Temporal.PlainTime): boolean =>
    Temporal.PlainTime.compare(time, start) >= 0 && Temporal.PlainTime.compare(time, end) < 0

export const isInstantAfter = (instant1: Temporal.Instant, instant2: Temporal.Instant): boolean =>
    Temporal.Instant.compare(instant1, instant2) > 0

export const isInstantAtOrAfter = (instant1: Temporal.Instant, instant2: Temporal.Instant): boolean =>
    Temporal.Instant.compare(instant1, instant2) >= 0

export const isInstantAtOrBefore = (instant1: Temporal.Instant, instant2: Temporal.Instant): boolean =>
    Temporal.Instant.compare(instant1, instant2) <= 0

export const isInstantBefore = (instant1: Temporal.Instant, instant2: Temporal.Instant): boolean =>
    Temporal.Instant.compare(instant1, instant2) < 0
