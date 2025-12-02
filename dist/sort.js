/**
 * Parses a SortArgument string to extract the property key and sort direction.
 */
const parseSortArgument = (property) => {
    const propertyString = String(property);
    const desc = propertyString.startsWith("-");
    const key = (desc ? propertyString.slice(1) : propertyString);
    return { desc, key };
};
/**
 * Locale-aware string comparison with numeric sorting.
 * Note: 'base' sensitivity ignores case and accents, which is often desirable for data sorting.
 */
const compareStrings = (a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });
/**
 * Check if a value is nullish (null or undefined).
 */
const isNullish = (value) => value == undefined;
/**
 * Compare two values with nullish handling.
 * Returns 0 if both are nullish, 1 if only a is nullish, -1 if only b is nullish, undefined otherwise.
 */
const compareNullish = (a, b) => {
    const aIsNullish = isNullish(a);
    const bIsNullish = isNullish(b);
    if (aIsNullish && bIsNullish)
        return 0;
    if (aIsNullish)
        return 1;
    if (bIsNullish)
        return -1;
    return undefined;
};
/**
 * Compare two values with explicit null/undefined handling and type coercion.
 * - null/undefined are treated as equal to each other, but greater than all non-null/undefined values (pushing them to the end).
 * - Tries numeric comparison first if both are numbers/convertible to numbers.
 * - Falls back to string comparison using localeCompare.
 */
const compareValues = (a, b) => {
    // 1. Quick equality check
    if (a === b)
        return 0;
    // 2. Null/undefined handling (pushes them to the end)
    const nullishResult = compareNullish(a, b);
    if (nullishResult !== undefined)
        return nullishResult;
    // 3. Try number comparison
    const numberA = Number(a);
    const numberB = Number(b);
    if (Number.isFinite(numberA) && Number.isFinite(numberB)) {
        return numberA - numberB;
    }
    // 4. Fallback to string comparison
    if (typeof a === "string" && typeof b === "string") {
        return compareStrings(a, b);
    }
    // 5. Different types or both objects - treat as equal
    return 0;
};
/**
 * Sort by a list of properties (in left-to-right order)
 * Properties prefixed with '-' are sorted in descending order
 * @example sortBy(['name', '-age']) // Sort by name ascending, then age descending
 */
export const sortBy = (propertyNames) => (a, b) => {
    for (const property of propertyNames) {
        const { desc, key } = parseSortArgument(property);
        const result = compareValues(a[key], b[key]);
        if (result !== 0) {
            return desc ? -result : result;
        }
    }
    return 0;
};
export function simpleNumberSort(a, b) {
    const nullishResult = compareNullish(a, b);
    if (nullishResult !== undefined)
        return nullishResult;
    // After compareNullish returns undefined, both a and b are guaranteed to be numbers
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return a - b;
}
export function simpleStringSort(a, b) {
    const nullishResult = compareNullish(a, b);
    if (nullishResult !== undefined)
        return nullishResult;
    // After compareNullish returns undefined, both a and b are guaranteed to be strings
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return compareStrings(a, b);
}
//# sourceMappingURL=sort.js.map