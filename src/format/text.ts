/**
 * Capitalizes the first letter of a string.
 * @link https://stackoverflow.com/a/1026087
 * @example capitalizeFirstLetter("hello") → "Hello"
 */
export const capitalizeFirstLetter = (text: string): string => {
    return text.charAt(0).toUpperCase() + text.slice(1)
}

const cardinalRules = new Intl.PluralRules("en", { type: "cardinal" })

/**
 * Returns the appropriate singular or plural form based on count.
 * Uses Intl.PluralRules for locale-aware pluralization.
 * @example pluralise(1, "item", "items") → "item"
 * @example pluralise(5, "item", "items") → "items"
 */
export const pluralise = (count: number, wordSingle: string, wordPlural: string): string => {
    const rule = cardinalRules.select(count)
    return rule === "one" ? wordSingle : wordPlural
}
