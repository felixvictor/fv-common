/** Values accepted by the coercing numeric helpers. */
export type NumberLike = number | string

/** `typeof` results that may represent a number. */
const numberLikeTypes: ReadonlySet<string> = new Set(["number", "string"])

/** Checks if a value is a valid object (not null, not an array). Acts as a type guard. */
export const isObject = (value: unknown): value is Record<PropertyKey, unknown> =>
    value !== null && typeof value === "object" && !Array.isArray(value)

/**
 * Checks if an object has no own enumerable string-keyed properties. Returns false if the input is not an object.
 * Inherited and symbol-keyed properties are not considered.
 */
export const isEmpty = (value: unknown): boolean => {
    if (!isObject(value)) return false
    for (const key in value) {
        if (Object.hasOwn(value, key)) return false
    }
    return true
}

/** Checks if a value is nullish (null or undefined). */
export const isNullish = (value: unknown): value is null | undefined => value === null || value === undefined

/** Checks if a value is nullish or NaN. */
export const isNullishOrNaN = (value: unknown): boolean => isNullish(value) || Number.isNaN(value)

/** Checks if a value is a number or a string, i.e. a candidate for numeric coercion. */
export const isNumberLike = (value: unknown): value is NumberLike => numberLikeTypes.has(typeof value)

/**
 * Coerces a number or string to a number. Whitespace-only strings yield NaN instead of `Number`'s default of 0.
 * Infinite values are preserved.
 */
export const parseNumberLike = (value: NumberLike): number =>
    typeof value === "string" && value.trim() === "" ? Number.NaN : Number(value)

/** Checks if any of the given numbers is NaN. */
const hasNaN = (...values: readonly number[]): boolean => values.some((value) => Number.isNaN(value))

/**
 * Attempts to coerce a value of any type to a finite number.
 *
 * Only numbers and strings are considered; booleans, bigints, symbols, functions, arrays and objects are rejected
 * regardless of their coercion behaviour. Whitespace-only strings, NaN and infinite values are likewise rejected.
 *
 * Returns the numeric representation, or `undefined` if the value cannot be safely treated as a finite number.
 */
export const toFiniteNumber = (value: unknown): number | undefined => {
    if (!isNumberLike(value)) return undefined
    const numberValue = parseNumberLike(value)
    return Number.isFinite(numberValue) ? numberValue : undefined
}

/** Determines whether a value of any type can be treated as a finite, real number. */
export const isNumeric = (value: unknown): boolean => toFiniteNumber(value) !== undefined

/**
 * A high-performance version of {@link clamp} that assumes valid numeric inputs and `min <= max`. Use in
 * performance-critical loops where inputs are pre-validated.
 */
export const clampUnsafe = (value: number, min: number, max: number): number =>
    value < min ? min : Math.min(value, max)

/**
 * Clamps a value between two boundaries. If `min > max`, the boundaries are swapped. Infinite boundaries are allowed.
 * Returns NaN if any input cannot be converted to a number (including whitespace-only strings).
 */
export const clamp = (value: NumberLike, min: NumberLike, max: NumberLike): number => {
    const valueNumber = parseNumberLike(value)
    const minNumber = parseNumberLike(min)
    const maxNumber = parseNumberLike(max)

    if (hasNaN(valueNumber, minNumber, maxNumber)) return Number.NaN

    return clampUnsafe(valueNumber, Math.min(minNumber, maxNumber), Math.max(minNumber, maxNumber))
}

/**
 * A high-performance version of {@link lerp} that assumes valid numeric inputs. Use in performance-critical loops where
 * inputs are pre-validated.
 */
export const lerpUnsafe = (start: number, end: number, t: number): number => start + (end - start) * t

/**
 * Linearly interpolates between two values by factor `t`. `t` in [0, 1] interpolates; values outside that range
 * extrapolate. Returns NaN if any input cannot be converted to a number (including whitespace-only strings).
 */
export const lerp = (start: NumberLike, end: NumberLike, t: NumberLike): number => {
    const startNumber = parseNumberLike(start)
    const endNumber = parseNumberLike(end)
    const tNumber = parseNumberLike(t)

    if (hasNaN(startNumber, endNumber, tNumber)) return Number.NaN

    return lerpUnsafe(startNumber, endNumber, tNumber)
}
