import { cSpaceThin } from "@/unicode"

/** Adds styled span/tspan wrapper for compact notation suffixes. */
export const addSpan = (suffix: string, isSvg: boolean): string =>
    isSvg ? `<tspan class="caps">${suffix}</tspan>` : `<span class="caps">${suffix}</span>`

/**
 * Beautifies compact notation suffixes with styling and spacing. The letters of the suffix are set lower case in a caps
 * span, whatever case the locale gives: `en-GB` yields `k`, `m`, `bn`, `en-US` yields `K`, `M`, `B`. Other characters
 * (e.g. the full stop of `de-DE` `Mio.`) stay outside the span.
 */
export const beautifySuffix = (suffix: string, isSvg: boolean): string =>
    cSpaceThin + suffix.replace(/\p{L}+/u, (letters) => addSpan(letters.toLowerCase(), isSvg))

export const formatUnit = (u: string, isSvg = false): string => {
    if (u === u.toLowerCase()) {
        return u
    }

    const tag = isSvg ? "tspan" : "span"

    if (u.length > 1) {
        return `<${tag} class="caps">${u}</${tag}>`
    }

    return `<${tag} style="font-variant-caps: all-small-caps">${u}</${tag}>`
}

export const truncate = (string: string, n: number): string => {
    return string.length > n ? `${string.slice(0, n - 1)}…` : string
}
