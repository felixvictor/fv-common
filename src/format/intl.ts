import { getLocale } from "@/locale"
import { cMinus, cPlus, cSpaceNarrowNoBreaking, cSpaceThin } from "@/unicode"

import { beautifySuffix } from "./helpers.js"

/**
 * Internal number formatter using Intl.NumberFormat with custom typographic enhancements.
 * Applies thin spaces, proper minus signs, and styled compact notation.
 */
export const formatWithIntl = (value: number, options: Intl.NumberFormatOptions, isSvg = false): string =>
    new Intl.NumberFormat(getLocale(), options)
        .formatToParts(value)
        .map((part, index, parts) => {
            switch (part.type) {
                case "compact": {
                    return beautifySuffix(part.value, isSvg)
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
                    if (part.value === "-") {
                        return `${cMinus}${cSpaceNarrowNoBreaking}`
                    }

                    const next = parts[index + 1]
                    // Intl.NumberFormat may already insert a space before the percent sign
                    // (e.g. de-DE), and we add our own via percentSign, resulting in a
                    // double space. Drop this literal if it's just whitespace preceding
                    // the percent sign.
                    if (next?.type === "percentSign" && part.value.trim() === "") {
                        return ""
                    }
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
