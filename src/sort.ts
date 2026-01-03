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
 * Check if a value is nullish (null or undefined).
 */
const isNullish = (value: unknown): value is null | undefined => value == undefined

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
 * Compare two values with explicit null/undefined handling and type coercion.
 * - null/undefined are treated as equal to each other, but greater than all non-null/undefined values (pushing them to the end).
 * - Tries numeric comparison first if both are numbers/convertible to numbers.
 * - Falls back to string comparison using localeCompare.
 */
const compareValues = (a: unknown, b: unknown): number => {
    // 1. Quick equality check
    if (a === b) return 0

    // 2. Null/undefined handling (pushes them to the end)
    const nullishResult = compareNullish(a, b)
    if (nullishResult !== undefined) return nullishResult

    // 3. Try number comparison
    const numberA = Number(a)
    const numberB = Number(b)

    if (Number.isFinite(numberA) && Number.isFinite(numberB)) {
        return numberA - numberB
    }

    // 4. Fallback to string comparison
    if (typeof a === "string" && typeof b === "string") {
        return compareStrings(a, b)
    }

    // 5. Different types or both objects, treat as equal
    return 0
}

/**
 * Sort by a list of properties (in left-to-right order)
 * Properties prefixed with '-' are sorted in descending order
 * @example sortBy(['name', '-age']) // Sort by name ascending, then age descending
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
 * Simple number comparison with null/undefined handling (pushes nullish values to the end).
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
 * Simple string comparison with null/undefined handling (pushes nullish values to the end).
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
