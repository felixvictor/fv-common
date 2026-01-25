import { cSpaceThin } from "../unicode.js"

/**
 * Adds styled span/tspan wrapper for compact notation suffixes.
 */
export const addSpan = (suffix: string, svg: boolean): string =>
    svg ? `<tspan class="caps">${suffix}</tspan>` : `<span class="caps">${suffix}</span>`

/**
 * Beautifies compact notation suffixes (K, M) with styling and spacing.
 */
export const beautifySuffix = (suffix: string, svg: boolean): string =>
    cSpaceThin + suffix.replace("K", addSpan("k", svg)).replace("M", addSpan("m", svg))

export const formatUnit = (u: string, svg = false): string => {
    if (u === u.toLowerCase()) {
        return u
    }

    const tag = svg ? "tspan" : "span"

    if (u.length > 1) {
        return `<${tag} class="caps">${u}</${tag}>`
    }

    return `<${tag} style="font-variant-caps: all-small-caps">${u}</${tag}>`
}

export const truncate = (string: string, n: number): string => {
    return string.length > n ? `${string.slice(0, n - 1)}…` : string
}
