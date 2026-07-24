export interface EarlyCloseAdjustedTime {
    default: Temporal.PlainTime
    earlyClose: Temporal.PlainTime
}

export interface PlainTimeWindow {
    end: EarlyCloseAdjustedTime | Temporal.PlainTime
    start: Temporal.PlainTime
}

export interface TimeWindow {
    info: (nyDate: Temporal.PlainDate) => string
    order: number
    text: string
    window: PlainTimeWindow
}
