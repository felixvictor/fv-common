import { isNullishOrNaN, toFiniteNumber } from "./common.js"
import { getLocale } from "./locale.js"

const locale = getLocale()
// 'base' sensitivity ignores case and accents, which is often desirable for data sorting.
const collator = new Intl.Collator(locale, { numeric: true, sensitivity: "base" })

/** Sort argument type. keyof T for ascending, `-${string & keyof T}` for descending. */
export type SortArgument<T> = `-${keyof T & string}` | keyof T
interface ParsedSortArgument<T> {
    isDescending: boolean
    key: keyof T
}

/** Parses a SortArgument to extract its property key and sort direction. */
const parseSortArgument = <T extends object>(sortArgument: SortArgument<T>): ParsedSortArgument<T> => {
    const sortArgumentString = String(sortArgument)
    const isDescending = sortArgumentString.startsWith("-")
    const key = (isDescending ? sortArgumentString.slice(1) : sortArgumentString) as keyof T
    return { isDescending, key }
}

/** Locale-aware string comparison with numeric sorting. */
const getStringSortOrder = (a: string, b: string): number => collator.compare(a, b)

/**
 * Handles the sorting weight for nullish or NaN values. Returns the sort order if any value is invalid, otherwise
 * undefined.
 */
const getNonValueSortOrder = (a: unknown, b: unknown): number | undefined => {
    const hasNoValueA = isNullishOrNaN(a)
    const hasNoValueB = isNullishOrNaN(b)

    if (hasNoValueA && hasNoValueB) return 0
    if (hasNoValueA) return 1
    if (hasNoValueB) return -1
    return undefined
}

/**
 * Compares two values of any type, with explicit null/undefined/NaN and type-coercion handling.
 *
 * Comparison is performed in the following order of precedence: 1. Referential equality — returns 0 immediately. 2.
 * Non-values — null, undefined and NaN are considered equal to each other and are sorted to the end of the list. 3.
 * Numeric comparison — if both values can be coerced to a finite number, they are compared numerically. 4. String
 * comparison — falls back to locale-aware string comparison. 5. Incomparable types — values that cannot be compared
 * meaningfully are treated as equal.
 */
const getSortOrder = (a: unknown, b: unknown, isDescending: boolean): number => {
    if (a === b) return 0

    const nonValueSortOrder = getNonValueSortOrder(a, b)
    if (nonValueSortOrder !== undefined) return nonValueSortOrder

    let valueSortOrder = 0
    const numberA = toFiniteNumber(a)
    const numberB = toFiniteNumber(b)

    if (numberA !== undefined && numberB !== undefined) {
        valueSortOrder = numberA - numberB
    } else if (typeof a === "string" && typeof b === "string") {
        valueSortOrder = getStringSortOrder(a, b)
    }

    // Invert only on valid values
    return isDescending ? -valueSortOrder : valueSortOrder
}

/**
 * Returns a comparator function that sorts an array of objects by one or more properties.
 *
 * Properties are evaluated left to right; the next property is only consulted when the preceding one yields equality.
 * Prefix a property name with `-` to sort that property in descending order.
 *
 * @example
 *     people.sort(sortBy(["name", "-age"]))
 *     // Sorts by name ascending, then by age descending.
 */
export const sortBy = <T extends object>(sortArguments: SortArgument<T>[]) => {
    const parsedSortArguments = sortArguments.map((sortArgument) => parseSortArgument(sortArgument))

    return (a: T, b: T): number => {
        for (const { isDescending, key } of parsedSortArguments) {
            const sortOrder = getSortOrder(a[key], b[key], isDescending)
            if (sortOrder !== 0) {
                return sortOrder
            }
        }
        return 0
    }
}

/** Comparator for numeric values, with null, undefined and NaN sorted to the end. */
export function simpleNumberSort(a: number, b: number): number
export function simpleNumberSort(a: null | number | undefined, b: null | number | undefined): number
export function simpleNumberSort(a: null | number | undefined, b: null | number | undefined): number {
    const nullishResult = getNonValueSortOrder(a, b)
    if (nullishResult !== undefined) return nullishResult

    // After getNonValueSortOrder returns undefined, both a and b are guaranteed to be numbers
    // oxlint-disable typescript/non-nullable-type-assertion-style
    return (a as number) - (b as number)
}

/** Comparator for string values, with null, undefined and NaN sorted to the end. */
export function simpleStringSort(a: string, b: string): number
export function simpleStringSort(a: null | string | undefined, b: null | string | undefined): number
export function simpleStringSort(a: null | string | undefined, b: null | string | undefined): number {
    const nullishResult = getNonValueSortOrder(a, b)
    if (nullishResult !== undefined) return nullishResult

    // After getNonValueSortOrder returns undefined, both a and b are guaranteed to be strings
    // oxlint-disable typescript/non-nullable-type-assertion-style
    return getStringSortOrder(a as string, b as string)
}
