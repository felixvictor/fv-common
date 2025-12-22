import { getLocale } from "../locale.js"
import { getCardinalRules } from "./cardinal.js"

/**
 * Capitalizes the first letter of a string using locale-aware rules.
 * @example capitalizeFirstLetter("hello") → "Hello"
 * @example capitalizeFirstLetter("istanbul") → "İstanbul" (in Turkish locale)
 */
export const capitalizeFirstLetter = (text: string, locale?: string): string => {
    if (!text) return text
    const effectiveLocale = locale ?? getLocale()
    return text.charAt(0).toLocaleUpperCase(effectiveLocale) + text.slice(1)
}

/**
 * Returns the appropriate singular or plural form based on count.
 * Uses Intl.PluralRules for locale-aware pluralisation.
 * @example pluralise(1, "item", "items") → "item"
 * @example pluralise(5, "item", "items") → "items"
 */
export const pluralise = (count: number, wordSingle: string, wordPlural?: string): string => {
    const cardinalRules = getCardinalRules(getLocale())
    const rule = cardinalRules.select(count)
    return rule === "one" ? wordSingle : (wordPlural ?? `${wordSingle}s`)
}
