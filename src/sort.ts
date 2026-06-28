import { isNullish, toFiniteNumber } from "./common.js"
import { getLocale } from "./locale.js"

const locale = getLocale()

/**
 * Sort argument type.
 * keyof T for ascending, `-${string & keyof T}` for descending.
 */
export type SortArgument<T> = `-${keyof T & string}` | keyof T

/**
 * Parses a SortArgument string to extract the property key and sort direction.
 */
const parseSortArgument = <T extends object>(property: SortArgument<T>): { isDesc: boolean; key: keyof T } => {
    const propertyString = String(property)
    const isDesc = propertyString.startsWith("-")
    const key = (isDesc ? propertyString.slice(1) : propertyString) as keyof T
    return { isDesc, key }
}

/**
 * Locale-aware string comparison with numeric sorting.
 * Note: 'base' sensitivity ignores case and accents, which is often desirable for data sorting.
 */
const compareStrings = (a: string, b: string): number =>
    a.localeCompare(b, locale, { numeric: true, sensitivity: "base" })

/**
 * Compare two values with nullish handling.
 * Returns 0 if both are nullish, 1 if only a is nullish, -1 if only b is nullish, undefined otherwise.
 */
const compareNullish = (a: unknown, b: unknown): number | undefined => {
    const isNullishA = isNullish(a)
    const isNullishB = isNullish(b)

    if (isNullishA && isNullishB) return 0
    if (isNullishA) return 1
    if (isNullishB) return -1
    return undefined
}

/**
 * Compares two values of any type, with explicit null/undefined and type-coercion handling.
 *
 * Comparison is performed in the following order of precedence:
 * 1. Referential equality — returns 0 immediately.
 * 2. Nullish values — null and undefined are considered equal to each other
 *    and are sorted to the end of the list.
 * 3. Numeric comparison — if both values can be coerced to a finite number,
 *    they are compared numerically.
 * 4. String comparison — falls back to locale-aware string comparison.
 * 5. Incomparable types — values that cannot be compared meaningfully are treated as equal.
 */
const compareValues = (a: unknown, b: unknown): number => {
    if (a === b) return 0

    const nullishResult = compareNullish(a, b)
    if (nullishResult !== undefined) return nullishResult

    const numberA = toFiniteNumber(a)
    const numberB = toFiniteNumber(b)
    if (numberA !== undefined && numberB !== undefined) {
        return numberA - numberB
    }

    if (typeof a === "string" && typeof b === "string") {
        return compareStrings(a, b)
    }

    return 0
}

/**
 * Returns a comparator function that sorts an array of objects by one or more properties.
 *
 * Properties are evaluated left to right; the next property is only consulted
 * when the preceding one yields equality. Prefix a property name with `-` to
 * sort that property in descending order.
 *
 * @example
 * people.sort(sortBy(['name', '-age']))
 * // Sorts by name ascending, then by age descending.
 */
export const sortBy =
    <T extends object>(propertyNames: SortArgument<T>[]) =>
    (a: T, b: T): number => {
        for (const property of propertyNames) {
            const { isDesc, key } = parseSortArgument(property)
            const result = compareValues(a[key], b[key])

            if (result !== 0) {
                return isDesc ? -result : result
            }
        }
        return 0
    }

/**
 * Comparator for numeric values, with null and undefined sorted to the end.
 */
export function simpleNumberSort(a: number, b: number): number
export function simpleNumberSort(a: null | number | undefined, b: null | number | undefined): number
export function simpleNumberSort(a: null | number | undefined, b: null | number | undefined): number {
    const nullishResult = compareNullish(a, b)
    if (nullishResult !== undefined) return nullishResult

    // After compareNullish returns undefined, both a and b are guaranteed to be numbers
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return a! - b!
}

/**
 * Comparator for string values, with null and undefined sorted to the end.
 */
export function simpleStringSort(a: string, b: string): number
export function simpleStringSort(a: null | string | undefined, b: null | string | undefined): number
export function simpleStringSort(a: null | string | undefined, b: null | string | undefined): number {
    const nullishResult = compareNullish(a, b)
    if (nullishResult !== undefined) return nullishResult

    // After compareNullish returns undefined, both a and b are guaranteed to be strings
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return compareStrings(a!, b!)
}
