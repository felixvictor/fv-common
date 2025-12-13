/**
 * Capitalizes the first letter of a string.
 * @link https://stackoverflow.com/a/1026087
 * @example capitalizeFirstLetter("hello") → "Hello"
 */
export declare const capitalizeFirstLetter: (text: string) => string;
/**
 * Returns the appropriate singular or plural form based on count.
 * Uses Intl.PluralRules for locale-aware pluralization.
 * @example pluralise(1, "item", "items") → "item"
 * @example pluralise(5, "item", "items") → "items"
 */
export declare const pluralise: (count: number, wordSingle: string, wordPlural: string) => string;
//# sourceMappingURL=text.d.ts.map