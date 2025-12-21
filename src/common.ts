export const clamp = (x: number | string, min: number | string, max: number | string): number => {
    let lower = Number(min)
    let upper = Number(max)
    const value = Number(x)

    if (Number.isNaN(value) || Number.isNaN(lower) || Number.isNaN(upper)) {
        return Number.NaN
    }

    if (lower > upper) {
        ;[lower, upper] = [upper, lower]
    }
    return Math.min(Math.max(value, lower), upper)
}

export const isEmpty = (object: null | Record<string, unknown> | undefined): boolean =>
    object !== undefined && object !== null && Object.keys(object).length === 0
