/**
 * Sort argument type.
 * keyof T for ascending, `-${string & keyof T}` for descending.
 */
export type SortArgument<T> = keyof T | `-${string & keyof T}`

/**
 * Parses a SortArgument string to extract the property key and sort direction.
 */
const parseSortArgument = <T extends object>(property: SortArgument<T>): { key: keyof T; desc: boolean } => {
    const propertyString = String(property)
    const desc = propertyString.startsWith("-")
    // The key is the property string without the optional leading '-'
    const key = (desc ? propertyString.slice(1) : propertyString) as keyof T
    return { key, desc }
}

/**
 * Locale-aware string comparison with numeric sorting.
 * Note: 'base' sensitivity ignores case and accents, which is often desirable for data sorting.
 */
const compareStrings = (a: string, b: string): number =>
    a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })

/**
 * Compare two values with explicit null/undefined handling and type coercion.
 * - null/undefined are treated as equal to each other, but greater than all non-null/undefined values (pushing them to the end).
 * - Tries numeric comparison first if both are numbers/convertible to numbers.
 * - Falls back to string comparison using localeCompare.
 */
const compareValues = (a: unknown, b: unknown): number => {
    // 1. Quick equality check
    if (a === b) {
        return 0
    }

    // 2. Null/undefined handling (pushes them to the end)
    const aIsNullish = a == undefined
    const bIsNullish = b == undefined

    if (aIsNullish && bIsNullish) {
        return 0
    }
    // If only 'a' is nullish, it should be greater (come later in ascending sort)
    if (aIsNullish) {
        return 1
    }
    // If only 'b' is nullish, it should be greater (come later in ascending sort)
    if (bIsNullish) {
        return -1
    }

    // 3. Try number comparison (handles number, string of number, boolean)
    const numberA = Number(a)
    const numberB = Number(b)

    const aIsFinite = Number.isFinite(numberA)
    const bIsFinite = Number.isFinite(numberB)

    if (aIsFinite && bIsFinite) {
        // Fallback to strict comparison for cases like Infinity, NaN if they weren't caught by isFinite
        return numberA - numberB
    }

    // 4. Fallback to string comparison for all others
    if (typeof a === "string" && typeof b === "string") {
        return compareStrings(a, b)
    }

    // If they are different types or both objects, treat them as equal for the sake of this property.
    // This is a common pattern in complex sorters to let the next property determine the order.
    return 0
}

// --- Exported Functions ---

/**
 * Sort by a list of properties (in left-to-right order)
 * Properties prefixed with '-' are sorted in descending order
 * @example sortBy(['name', '-age']) // Sort by name ascending, then age descending
 */
export const sortBy =
    <T extends object>(propertyNames: SortArgument<T>[]) =>
    (a: T, b: T): number => {
        for (const property of propertyNames) {
            const { key, desc } = parseSortArgument(property)

            const result = compareValues(a[key], b[key])

            if (result !== 0) {
                // Apply descending order if needed
                return desc ? -result : result
            }
        }
        return 0
    }

/**
 * Simple number comparison with null/undefined handling (pushes nullish values to the end).
 */
export const simpleNumberSort = (a: number | undefined | null, b: number | undefined | null): number => {
    const aIsNullish = a == undefined
    const bIsNullish = b == undefined

    if (aIsNullish && bIsNullish) {
        return 0
    }
    if (aIsNullish) {
        return 1
    }
    if (bIsNullish) {
        return -1
    }
    // Type-safe comparison now that we've checked for nullish values
    return a - b
}

/**
 * Simple string comparison with null/undefined handling (pushes nullish values to the end).
 */
export const simpleStringSort = (a: string | undefined | null, b: string | undefined | null): number => {
    const aIsNullish = a == undefined
    const bIsNullish = b == undefined

    if (aIsNullish && bIsNullish) {
        return 0
    }
    if (aIsNullish) {
        return 1
    }
    if (bIsNullish) {
        return -1
    }
    // Type-safe comparison now that we've checked for nullish values
    return compareStrings(a, b)
}
