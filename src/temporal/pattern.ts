/**
 * Format patterns for Temporal values in Moment.js/Day.js token syntax.
 *
 * Formatting supports the tokens YYYY, YY, M, MM, MMM, MMMM, D, DD, d (weekday, 0 = Sunday), ddd, dddd, H, HH, h, hh,
 * m, mm, s, ss, SSS, A and a; month and weekday names come from `Intl.DateTimeFormat`. Text in square brackets is
 * emitted verbatim, every other character is a literal. Other tokens of that syntax (e.g. dd, Z) raise a RangeError.
 *
 * Parsing supports YYYY, YY, M, MM, MMM, MMMM, D, DD, H, HH, m, mm, s, ss and SSS. Literals are skipped by length,
 * missing date parts default to the current date, and out-of-range values are rejected.
 */
import { getLocale } from "@/locale"

export interface ParsePatternOptions {
    /** Requires `value` to equal the re-formatted result, e.g. zero-padded numbers for DD. */
    isStrict?: boolean | undefined
    /** Locale for month names; defaults to the library locale. */
    locale?: string | undefined
}

/** Date-time values {@link formatPattern} accepts. */
export type PatternDateTime = Temporal.PlainDateTime | Temporal.ZonedDateTime

type DateField = "day" | "hour" | "millisecond" | "minute" | "month" | "second" | "year"
type DateFields = Partial<Record<DateField, number>>
type NameStyle = "long" | "short"
type TokenFormatter = (dateTime: PatternDateTime, locale: string) => string

interface TokenMatch {
    readonly length: number
    readonly value: number
}

interface TokenParser {
    readonly field: DateField
    readonly read: TokenReader
}

type TokenReader = (input: string, position: number, locale: string) => TokenMatch | undefined

/** Complete token grammar of the syntax, so unsupported tokens are detected rather than treated as literals. */
const tokenPattern = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g

const yearDigits = 4
const shortYearDigits = 2
const twoDigits = 2
const millisecondDigits = 3
const hoursPerHalfDay = 12
const daysPerWeek = 7
const monthsPerYear = 12
/** Two-digit years above this value belong to the twentieth century, the others to the twenty-first. */
const twoDigitYearPivot = 68
const twentiethCenturyStart = 1900
const twentyFirstCenturyStart = 2000
/** 1 January 2024 is a Monday, so day `n` of January 2024 has ISO weekday `n`. */
const referenceYear = 2024
const januaryIndex = 0

const padNumber = (value: number, length: number): string => String(value).padStart(length, "0")

const getTwelveHour = (hour: number): number => hour % hoursPerHalfDay || hoursPerHalfDay

/** Month name in its in-date form (genitive where a language distinguishes it), e.g. "Januar". */
const getMonthName = (month: number, locale: string, style: NameStyle): string => {
    const formatter = new Intl.DateTimeFormat(locale, { day: "numeric", month: style, timeZone: "UTC" })
    const parts = formatter.formatToParts(Date.UTC(referenceYear, month - 1, 1))

    return parts.find((part) => part.type === "month")?.value ?? ""
}

const getWeekdayName = (dayOfWeek: number, locale: string, style: NameStyle): string =>
    new Intl.DateTimeFormat(locale, { timeZone: "UTC", weekday: style }).format(
        Date.UTC(referenceYear, januaryIndex, dayOfWeek),
    )

const tokenFormatters: ReadonlyMap<string, TokenFormatter> = new Map<string, TokenFormatter>([
    ["A", (dateTime) => (dateTime.hour < hoursPerHalfDay ? "AM" : "PM")],
    ["a", (dateTime) => (dateTime.hour < hoursPerHalfDay ? "am" : "pm")],
    ["D", (dateTime) => String(dateTime.day)],
    // Token d numbers weekdays from 0 (Sunday), Temporal from 1 (Monday) to 7 (Sunday)
    ["d", (dateTime) => String(dateTime.dayOfWeek % daysPerWeek)],
    ["DD", (dateTime) => padNumber(dateTime.day, twoDigits)],
    ["ddd", (dateTime, locale) => getWeekdayName(dateTime.dayOfWeek, locale, "short")],
    ["dddd", (dateTime, locale) => getWeekdayName(dateTime.dayOfWeek, locale, "long")],
    ["H", (dateTime) => String(dateTime.hour)],
    ["h", (dateTime) => String(getTwelveHour(dateTime.hour))],
    ["HH", (dateTime) => padNumber(dateTime.hour, twoDigits)],
    ["hh", (dateTime) => padNumber(getTwelveHour(dateTime.hour), twoDigits)],
    ["M", (dateTime) => String(dateTime.month)],
    ["m", (dateTime) => String(dateTime.minute)],
    ["MM", (dateTime) => padNumber(dateTime.month, twoDigits)],
    ["mm", (dateTime) => padNumber(dateTime.minute, twoDigits)],
    ["MMM", (dateTime, locale) => getMonthName(dateTime.month, locale, "short")],
    ["MMMM", (dateTime, locale) => getMonthName(dateTime.month, locale, "long")],
    ["s", (dateTime) => String(dateTime.second)],
    ["ss", (dateTime) => padNumber(dateTime.second, twoDigits)],
    ["SSS", (dateTime) => padNumber(dateTime.millisecond, millisecondDigits)],
    ["YY", (dateTime) => padNumber(dateTime.year, yearDigits).slice(-shortYearDigits)],
    ["YYYY", (dateTime) => padNumber(dateTime.year, yearDigits)],
])

const createDigitReader = (minimumDigits: number, maximumDigits: number): TokenReader => {
    const digits = new RegExp(String.raw`\d{${minimumDigits},${maximumDigits}}`, "y")

    return (input, position) => {
        digits.lastIndex = position
        const [match] = digits.exec(input) ?? []

        return match === undefined ? undefined : { length: match.length, value: Number(match) }
    }
}

const readOneOrTwoDigits = createDigitReader(1, twoDigits)
const readTwoDigits = createDigitReader(twoDigits, twoDigits)

const readTwoDigitYear: TokenReader = (input, position, locale) => {
    const match = readTwoDigits(input, position, locale)
    if (match === undefined) return undefined

    const centuryStart = match.value > twoDigitYearPivot ? twentiethCenturyStart : twentyFirstCenturyStart
    return { length: match.length, value: centuryStart + match.value }
}

const createMonthNameReader =
    (style: NameStyle): TokenReader =>
    (input, position, locale) => {
        const remainder = input.slice(position).toLocaleLowerCase(locale)
        let bestMatch: TokenMatch | undefined

        for (let month = 1; month <= monthsPerYear; month += 1) {
            const name = getMonthName(month, locale, style).toLocaleLowerCase(locale)
            const isLongerMatch = bestMatch === undefined || name.length > bestMatch.length

            if (name.length > 0 && remainder.startsWith(name) && isLongerMatch) {
                bestMatch = { length: name.length, value: month }
            }
        }

        return bestMatch
    }

const tokenParsers: ReadonlyMap<string, TokenParser> = new Map<string, TokenParser>([
    ["D", { field: "day", read: readOneOrTwoDigits }],
    ["DD", { field: "day", read: readTwoDigits }],
    ["H", { field: "hour", read: readOneOrTwoDigits }],
    ["HH", { field: "hour", read: readOneOrTwoDigits }],
    ["M", { field: "month", read: readOneOrTwoDigits }],
    ["m", { field: "minute", read: readOneOrTwoDigits }],
    ["MM", { field: "month", read: readTwoDigits }],
    ["mm", { field: "minute", read: readOneOrTwoDigits }],
    ["MMM", { field: "month", read: createMonthNameReader("short") }],
    ["MMMM", { field: "month", read: createMonthNameReader("long") }],
    ["s", { field: "second", read: readOneOrTwoDigits }],
    ["ss", { field: "second", read: readOneOrTwoDigits }],
    ["SSS", { field: "millisecond", read: createDigitReader(millisecondDigits, millisecondDigits) }],
    ["YY", { field: "year", read: readTwoDigitYear }],
    ["YYYY", { field: "year", read: createDigitReader(yearDigits, yearDigits) }],
])

/**
 * Builds a date-time from parsed fields. Missing parts default to: year, the current year; month, January if a year is
 * given, else the current month; day, 1 if a year or month is given, else today; time fields, 0.
 */
const toPlainDateTime = (fields: DateFields): Temporal.PlainDateTime | undefined => {
    const today = Temporal.Now.plainDateISO()
    const hasYear = fields.year !== undefined
    const hasMonth = fields.month !== undefined

    try {
        return Temporal.PlainDateTime.from(
            {
                day: fields.day ?? (hasYear || hasMonth ? 1 : today.day),
                hour: fields.hour ?? 0,
                millisecond: fields.millisecond ?? 0,
                minute: fields.minute ?? 0,
                month: fields.month ?? (hasYear ? 1 : today.month),
                second: fields.second ?? 0,
                year: fields.year ?? today.year,
            },
            { overflow: "reject" },
        )
    } catch (error: unknown) {
        if (error instanceof RangeError) return undefined
        throw error
    }
}

/**
 * Formats a date-time with a format pattern.
 *
 * @example
 *     formatPattern(Temporal.PlainDateTime.from("2024-01-15T14:30"), "dddd, D. MMMM, H.mm", "de") // "Montag, 15. Januar, 14.30"
 *
 * @param dateTime - Date-time to format; a ZonedDateTime is formatted in its own time zone.
 * @param pattern - Format pattern.
 * @param locale - Locale for month and weekday names; defaults to the library locale.
 * @throws {RangeError} If the pattern contains an unsupported token.
 */
export const formatPattern = (dateTime: PatternDateTime, pattern: string, locale?: string): string => {
    const effectiveLocale = locale ?? getLocale()

    return pattern.replaceAll(tokenPattern, (token: string, escapedText: string | undefined) => {
        if (escapedText !== undefined) return escapedText

        const formatter = tokenFormatters.get(token)
        if (formatter === undefined) throw new RangeError(`Unsupported format token "${token}" in "${pattern}"`)

        return formatter(dateTime, effectiveLocale)
    })
}

/**
 * Parses a string with a format pattern.
 *
 * @example
 *     parsePattern("15.01.2024 14:30", "DD.MM.YYYY HH:mm") // Temporal.PlainDateTime 2024-01-15T14:30:00
 *
 * @param value - String to parse.
 * @param pattern - Format pattern.
 * @param options - Strict mode and locale.
 * @returns The parsed wall-clock date-time, or undefined if `value` does not match `pattern`.
 * @throws {RangeError} If the pattern contains a token that cannot be parsed.
 */
export const parsePattern = (
    value: string,
    pattern: string,
    options: ParsePatternOptions = {},
): Temporal.PlainDateTime | undefined => {
    const locale = options.locale ?? getLocale()
    const fields: DateFields = {}
    let patternPosition = 0
    let inputPosition = 0

    for (const tokenMatch of pattern.matchAll(tokenPattern)) {
        const [token, escapedText] = tokenMatch

        // Literal text before the token is skipped by length
        inputPosition += tokenMatch.index - patternPosition
        patternPosition = tokenMatch.index + token.length

        if (escapedText !== undefined) {
            inputPosition += escapedText.length
            continue
        }

        const parser = tokenParsers.get(token)
        if (parser === undefined) throw new RangeError(`Unsupported parse token "${token}" in "${pattern}"`)

        const match = parser.read(value, inputPosition, locale)
        if (match === undefined) return undefined

        fields[parser.field] = match.value
        inputPosition += match.length
    }

    const dateTime = toPlainDateTime(fields)
    const isRejectedByStrictMode =
        dateTime !== undefined && options.isStrict === true && formatPattern(dateTime, pattern, locale) !== value

    return isRejectedByStrictMode ? undefined : dateTime
}
