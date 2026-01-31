/**
 * Checks if a value is a valid object (not null, not an array).
 * This acts as a Type Guard for TypeScript.
 */
export const isObject = (value: unknown): value is Record<PropertyKey, unknown> =>
    value !== null && typeof value === "object" && !Array.isArray(value)

/**
 * Checks if an object has no own enumerable properties.
 * Returns false if the input is not an object.
 */
export const isEmpty = (value: unknown): boolean => {
    if (!isObject(value)) return false

    // High-performance check to avoid array allocation from Object.keys()
    for (const _ in value) return false
    return true
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
    if (isNaN(valueNumber) || isNaN(minNumber) || isNaN(maxNumber)) return Number.NaN

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
