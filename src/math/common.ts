/**
 * Tests if a number is between two bounds (order-independent).
 *
 * @param value - The number to test.
 * @param a - First bound (can be min or max).
 * @param b - Second bound (can be min or max).
 * @param inclusive - If true, bounds are included in the range. Default is true.
 * @returns True if value is within the range defined by a and b.
 *
 * @example
 * between(5, 1, 10) // true
 * between(5, 10, 1) // true (order-independent)
 * between(1, 1, 10) // true (inclusive by default)
 * between(1, 1, 10, false) // false (exclusive)
 */
export const between = (value: number, a: number, b: number, inclusive = true): boolean => {
    const min = Math.min(a, b)
    const max = Math.max(a, b)
    return inclusive ? value >= min && value <= max : value > min && value < max
}
