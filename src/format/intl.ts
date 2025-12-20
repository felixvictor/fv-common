import { cMinus, cPlus, cSpaceNarrowNoBreaking, cSpaceThin } from "../unicode.js"
import { getLocale } from "./config.js"
import { beautifySuffix } from "./helpers.js"

/**
 * Internal number formatter using Intl.NumberFormat with custom typographic enhancements.
 * Applies thin spaces, proper minus signs, and styled compact notation.
 */
export const formatWithIntl = (value: number, options: Intl.NumberFormatOptions, svg = false): string =>
    new Intl.NumberFormat(getLocale(), options)
        .formatToParts(value)
        .map((part) => {
            switch (part.type) {
                case "compact": {
                    return beautifySuffix(part.value, svg)
                }

                case "currency": {
                    return part.value
                }

                case "decimal": {
                    return part.value
                }

                case "fraction": {
                    return part.value
                }

                case "group": {
                    return cSpaceThin
                }

                case "integer": {
                    return part.value
                }

                case "literal": {
                    return part.value
                }

                case "minusSign": {
                    return `${cMinus}${cSpaceNarrowNoBreaking}`
                }

                case "percentSign": {
                    return `${cSpaceNarrowNoBreaking}%`
                }

                case "plusSign": {
                    return `${cPlus}${cSpaceNarrowNoBreaking}`
                }

                case "unit": {
                    return part.value
                }
            }
            return part.value
        })
        .join("")
