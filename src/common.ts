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
