import { getLocale } from "@/locale"

const ordinalRulesCache = new Map<string, Intl.PluralRules>()

const getOrdinalRules = (locale: string): Intl.PluralRules => {
    let rules = ordinalRulesCache.get(locale)
    if (!rules) {
        rules = new Intl.PluralRules(locale, { type: "ordinal" })
        ordinalRulesCache.set(locale, rules)
    }
    return rules
}

const suffixes = new Map([
    ["few", "rd"],
    ["one", "st"],
    ["other", "th"],
    ["two", "nd"],
])

const suffixesSuper = new Map([
    ["few", "ʳᵈ"],
    ["one", "ˢᵗ"],
    ["other", "ᵗʰ"],
    ["two", "ⁿᵈ"],
])

/**
 * Format ordinal number with appropriate suffix.
 * @param n - Integer
 * @param isSuperscript - True if superscript suffixes needed
 * @param locale - Optional locale override
 * @example getOrdinal(1) → "1ˢᵗ"
 * @example getOrdinal(2, false) → "2nd"
 * @example getOrdinal(3) → "3ʳᵈ"
 */
export const getOrdinal = (n: number, isSuperscript = true, locale?: string): string => {
    const effectiveLocale = locale ?? getLocale()
    const ordinalRules = getOrdinalRules(effectiveLocale)
    const rule = ordinalRules.select(n)
    const suffix = (isSuperscript ? suffixesSuper : suffixes).get(rule)
    return `${n}${suffix ?? ""}`
}
