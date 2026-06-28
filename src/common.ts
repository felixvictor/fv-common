/**
 * Checks if a value is a valid object (not null, not an array).
 * This acts as a Type Guard for TypeScript.
 */
export const isObject = (value: unknown): value is Record<PropertyKey, unknown> =>
    value !== null && typeof value === "object" && !Array.isArray(value)

/**
 * Checks if an object has no own enumerable properties.
 * Returns false if the input is not an object.
 * Note: inherited enumerable properties are not considered.
 */
export const isEmpty = (value: unknown): boolean => {
    if (!isObject(value)) return false
    for (const key in value) {
        if (Object.hasOwn(value, key)) return false
    }
    return true
}

/**
 * Check if a value is nullish (null or undefined).
 */
export const isNullish = (value: unknown): value is null | undefined => value == undefined

/**
 * Determines whether a given value of any type is a finite, real number.
 */
export const isNumeric = (value: unknown): value is number => toFiniteNumber(value) !== undefined

/**
 * Attempts to coerce a value of any type to a finite number.
 *
 * Explicitly rejects values that are not meaningfully numeric:
 * booleans, bigints, symbols, functions, arrays, and objects are all
 * treated as non-numeric regardless of their coercion behaviour.
 * Whitespace-only strings and values that produce `Infinity` are likewise rejected.
 *
 * Returns the numeric representation, or `undefined` if the value cannot be
 * safely treated as a finite number.
 */
export const toFiniteNumber = (value: unknown): number | undefined => {
    if (
        value === null ||
        value === undefined ||
        typeof value === "boolean" ||
        typeof value === "bigint" ||
        typeof value === "symbol" ||
        typeof value === "function" ||
        Array.isArray(value) ||
        typeof value === "object"
    ) {
        return
    }

    const coerced = value as number | string
    const n = Number(coerced)
    return Number.isFinite(n) && String(coerced).trim() !== "" ? n : undefined
}

/**
 * Clamps a numeric value between a minimum and maximum boundary.
 * If min > max, the boundaries are automatically swapped.
 * Returns NaN if any input cannot be converted to a number.
 */
export const clamp = (value: number | string, min: number | string, max: number | string): number => {
    const valueNumber = Number(value)
    let minNumber = Number(min)
    let maxNumber = Number(max)

    // eslint-disable-next-line unicorn/prefer-number-properties
    if (isNaN(valueNumber) || isNaN(minNumber) || isNaN(maxNumber)) return NaN

    if (minNumber > maxNumber) {
        const temporary = minNumber
        minNumber = maxNumber
        maxNumber = temporary
    }

    return valueNumber < minNumber ? minNumber : Math.min(valueNumber, maxNumber)
}

/**
 * A high-performance version of clamp that assumes valid numeric inputs
 * and that min is already less than or equal to max.
 * Use this in performance-critical loops where inputs are already pre-validated.
 */
export const clampUnsafe = (x: number, min: number, max: number): number => (x < min ? min : Math.min(x, max))
