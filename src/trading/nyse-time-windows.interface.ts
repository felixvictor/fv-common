export interface EarlyCloseAdjustedTime {
    default: Temporal.PlainTime
    earlyClose: Temporal.PlainTime
}

export interface PlainTimeWindow {
    end: EarlyCloseAdjustedTime | Temporal.PlainTime
    start: Temporal.PlainTime
}

export interface TimeWindow {
    info: (instant?: Temporal.Instant) => string
    order: number
    text: string
    window: PlainTimeWindow
}
