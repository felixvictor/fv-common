import { isNullishOrNaN, toFiniteNumber } from "./guard.js"
import { getLocale } from "./locale.js"

/** Comparator results. */
const sortOrder = { after: 1, before: -1, equal: 0 } as const

/** Type ranks for mixed-type comparison; lower ranks sort first in ascending order. */
const valueRank = { number: 0, other: 2, string: 1 } as const
type ValueRank = (typeof valueRank)[keyof typeof valueRank]

const descendingPrefix = "-"

/**
 * Locale-aware collator with numeric sorting. 'base' sensitivity ignores case and accents. The locale is resolved once
 * at module load.
 */
const collator = new Intl.Collator(getLocale(), { numeric: true, sensitivity: "base" })

/** A comparator as accepted by `Array.prototype.sort`. */
export type Comparator<T> = (a: T, b: T) => number

/** Sort argument: `keyof T` for ascending, `-${string & keyof T}` for descending. */
export type SortArgument<T> = `${typeof descendingPrefix}${keyof T & string}` | keyof T

interface ParsedSortArgument<T> {
    readonly isDescending: boolean
    readonly key: keyof T
}

/**
 * Parses a sort argument into its property key and direction. Number and symbol keys are always ascending. A string key
 * that itself starts with `-` cannot be sorted ascending.
 */
const parseSortArgument = <T extends object>(sortArgument: SortArgument<T>): ParsedSortArgument<T> => {
    if (typeof sortArgument !== "string" || !sortArgument.startsWith(descendingPrefix)) {
        return { isDescending: false, key: sortArgument as keyof T }
    }
    return { isDescending: true, key: sortArgument.slice(descendingPrefix.length) as keyof T }
}

/** Compares two numbers without subtraction, so infinite values of equal sign compare as equal rather than NaN. */
const compareNumbers: Comparator<number> = (a, b) => {
    if (a < b) return sortOrder.before
    if (a > b) return sortOrder.after
    return sortOrder.equal
}

/** Locale-aware string comparison with numeric sorting. */
const compareStrings: Comparator<string> = (a, b) => collator.compare(a, b)

/** Inverts a sort order for descending direction. */
const applyDirection = (order: number, isDescending: boolean): number => (isDescending ? -order : order)

/** Numeric value used for comparison: numbers as-is (including ±Infinity), numeric strings coerced, else undefined. */
const toComparableNumber = (value: unknown): number | undefined =>
    typeof value === "number" ? value : toFiniteNumber(value)

/** Determines the type rank of a value, given its precomputed comparable number. */
const getValueRank = (value: unknown, comparableNumber: number | undefined): ValueRank => {
    if (comparableNumber !== undefined) return valueRank.number
    if (typeof value === "string") return valueRank.string
    return valueRank.other
}

/**
 * Compares two present values of any type. Values of different type ranks are ordered by rank (numeric before string
 * before other), which keeps the comparator transitive for mixed-type data. Within a rank, numeric values compare
 * numerically, strings compare locale-aware, and all other values are treated as equal.
 */
const compareUnknown: Comparator<unknown> = (a, b) => {
    const numberA = toComparableNumber(a)
    const numberB = toComparableNumber(b)
    const rankA = getValueRank(a, numberA)
    const rankB = getValueRank(b, numberB)

    if (rankA !== rankB) return compareNumbers(rankA, rankB)
    if (numberA !== undefined && numberB !== undefined) return compareNumbers(numberA, numberB)
    if (typeof a === "string" && typeof b === "string") return compareStrings(a, b)
    return sortOrder.equal
}

/**
 * Compares two values with null, undefined and NaN treated as equal to each other and sorted to the end regardless of
 * direction. Present values are compared with `compareValues` and inverted if descending.
 */
const compareNonValuesLast = <V>(
    a: null | undefined | V,
    b: null | undefined | V,
    isDescending: boolean,
    compareValues: Comparator<V>,
): number => {
    if (a === b) return sortOrder.equal

    const isNonValueA = isNullishOrNaN(a)
    const isNonValueB = isNullishOrNaN(b)

    if (isNonValueA && isNonValueB) return sortOrder.equal
    if (isNonValueA) return sortOrder.after
    if (isNonValueB) return sortOrder.before

    // Both values are present; `isNullishOrNaN` cannot act as a type guard, as NaN is not expressible as a type.
    // oxlint-disable-next-line typescript/non-nullable-type-assertion-style
    return applyDirection(compareValues(a as V, b as V), isDescending)
}

/**
 * Returns a comparator that sorts objects by one or more properties.
 *
 * Properties are evaluated left to right; the next property is only consulted when the preceding one yields equality.
 * Prefix a property name with `-` to sort that property in descending order. Null, undefined and NaN always sort last.
 * Mixed-type values are ordered numeric, string, other (reversed when descending).
 *
 * @example
 *     people.sort(sortBy(["name", "-age"]))
 *     // Sorts by name ascending, then by age descending.
 */
export const sortBy = <T extends object>(sortArguments: readonly SortArgument<T>[]): Comparator<T> => {
    const parsedSortArguments = sortArguments.map((sortArgument) => parseSortArgument(sortArgument))

    return (a, b) => {
        for (const { isDescending, key } of parsedSortArguments) {
            const order = compareNonValuesLast<unknown>(a[key], b[key], isDescending, compareUnknown)
            if (order !== sortOrder.equal) return order
        }
        return sortOrder.equal
    }
}

/** Comparator for numbers, with null, undefined and NaN sorted to the end regardless of direction. */
export const simpleNumberSort = (
    a: null | number | undefined,
    b: null | number | undefined,
    isDescending = false,
): number => compareNonValuesLast(a, b, isDescending, compareNumbers)

/** Comparator for strings, with null and undefined sorted to the end regardless of direction. */
export const simpleStringSort = (
    a: null | string | undefined,
    b: null | string | undefined,
    isDescending = false,
): number => compareNonValuesLast(a, b, isDescending, compareStrings)
