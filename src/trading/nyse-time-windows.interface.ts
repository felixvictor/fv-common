export interface PlainTimeWindow {
    end: Temporal.PlainTime
    start: Temporal.PlainTime
}

export interface TimeWindow {
    info: string
    order: number
    text: string
    window: PlainTimeWindow
}
