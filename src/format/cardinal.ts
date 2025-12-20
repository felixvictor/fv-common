const cardinalRulesCache = new Map<string, Intl.PluralRules>()

export const getCardinalRules = (locale: string): Intl.PluralRules => {
    let rules = cardinalRulesCache.get(locale)
    if (!rules) {
        rules = new Intl.PluralRules(locale, { type: "cardinal" })
        cardinalRulesCache.set(locale, rules)
    }
    return rules
}
