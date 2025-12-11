export const clamp = (x, min, max) => {
    let lower = Number(min);
    let upper = Number(max);
    const value = Number(x);
    if (Number.isNaN(value) || Number.isNaN(lower) || Number.isNaN(upper)) {
        return Number.NaN;
    }
    if (lower > upper) {
        ;
        [lower, upper] = [upper, lower];
    }
    return Math.min(Math.max(value, lower), upper);
};
//# sourceMappingURL=common.js.map