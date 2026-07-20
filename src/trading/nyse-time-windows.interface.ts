export interface PlainTimeWindow {
    end: Temporal.PlainTime
    start: Temporal.PlainTime
}

export interface TimeWindow {
    order: number
    text: string
    window: PlainTimeWindow
}
