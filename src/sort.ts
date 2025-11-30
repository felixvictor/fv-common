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
            const valueA = a[key]
            const valueB = b[key]

            // Quick equality check
            if (valueA === valueB) {
                continue
            }

            // Null/undefined handling
            if (valueA == undefined) {
                return desc ? -1 : 1
            }
            if (valueB == undefined) {
                return desc ? 1 : -1
            }

            const typeA = typeof valueA
            const typeB = typeof valueB
            let result = 0

            // Same primitive types
            if (typeA === typeB) {
                switch (typeA) {
                    case "number": {
                        result = simpleNumberSort(valueA as number, valueB as number)

                        break
                    }
                    case "boolean": {
                        result = (valueA as boolean) ? 1 : -1

                        break
                    }
                    case "string": {
                        result = simpleStringSort(valueA as string, valueB as string)

                        break
                    }
                    // No default
                }
            } else {
                // Different types - try numeric comparison
                const numberA = Number(valueA)
                const numberB = Number(valueB)
                result =
                    !Number.isNaN(numberA) && !Number.isNaN(numberB)
                        ? simpleNumberSort(numberA, numberB)
                        : simpleStringSort(String(valueA), String(valueB))
            }

            if (result !== 0) {
                return desc ? -result : result
            }
        }
        return 0
    }

export const simpleNumberSort = (a: number | null | undefined, b: number | null | undefined): number => {
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

export const simpleStringSort = (a: string | null | undefined, b: string | null | undefined): number => {
    if (a == undefined && b == undefined) {
        return 0
    }
    if (a == undefined) {
        return 1
    }
    if (b == undefined) {
        return -1
    }
    return a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" })
}
