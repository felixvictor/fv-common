type SortArgument<T> = keyof T | `-${string & keyof T}`

/**
 * Sort by a list of properties (in left-to-right order)
 * Properties prefixed with '-' are sorted in descending order
 * @example sortBy(['name', '-age']) // Sort by name ascending, then age descending
 */
export const sortBy =
    <T extends object>(propertyNames: SortArgument<T>[]) =>
    (a: T, b: T): number => {
        for (const property of propertyNames) {
            const propertyString = String(property)
            const desc = propertyString.startsWith("-")
            const key = (desc ? propertyString.slice(1) : propertyString) as keyof T

            const result = compareValues(a[key], b[key])
            if (result !== 0) {
                return desc ? -result : result
            }
        }
        return 0
    }

/**
 * Locale-aware string comparison with numeric sorting
 */
const compareStrings = (a: string, b: string): number => {
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
}

/**
 * Safely convert value to string for comparison
 */
const toComparableString = (value: unknown): string => {
    if (typeof value === "string") {
        return value
    }
    if (typeof value === "number" || typeof value === "boolean") {
        return String(value)
    }
    if (value == undefined) {
        return ""
    }

    // For objects, use JSON.stringify or return empty string for non-serializable objects
    try {
        return JSON.stringify(value)
    } catch {
        return ""
    }
}

/**
 * Compare two values with proper null/undefined handling and type coercion
 */
const compareValues = (a: unknown, b: unknown): number => {
    // Quick equality check
    if (a === b) {
        return 0
    }

    // Null/undefined handling (treat as equal to each other, less than everything else)
    if (a == undefined && b == undefined) {
        return 0
    }
    if (a == undefined) {
        return 1
    }
    if (b == undefined) {
        return -1
    }

    const typeA = typeof a
    const typeB = typeof b

    // Same primitive types - use type-specific comparison
    if (typeA === typeB) {
        if (typeA === "number") {
            return (a as number) - (b as number)
        }
        if (typeA === "boolean") {
            return (a as boolean) ? 1 : -1
        }
        if (typeA === "string") {
            return compareStrings(a as string, b as string)
        }
    }

    // Different types - try numeric comparison, fallback to string
    const numberA = Number(a)
    const numberB = Number(b)

    if (!Number.isNaN(numberA) && !Number.isNaN(numberB)) {
        return numberA - numberB
    }

    return compareStrings(toComparableString(a), toComparableString(b))
}

/**
 * Simple number comparison with null/undefined handling
 */
export const simpleNumberSort = (a: number | undefined, b: number | undefined): number => {
    if (a == undefined && b == undefined) {
        return 0
    }
    if (a == undefined) {
        return 1
    }
    if (b == undefined) {
        return -1
    }
    return a - b
}

/**
 * Simple string comparison with null/undefined handling
 */
export const simpleStringSort = (a: string | undefined, b: string | undefined): number => {
    if (a == undefined && b == undefined) {
        return 0
    }
    if (a == undefined) {
        return 1
    }
    if (b == undefined) {
        return -1
    }
    return compareStrings(a, b)
}
