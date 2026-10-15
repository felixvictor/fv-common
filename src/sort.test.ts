/* oxlint-disable unicorn/no-null */

import { describe, expect, it } from "vitest"

import { simpleNumberSort, simpleStringSort, type SortArgument, sortBy } from "./sort.js"

interface Person {
    age: null | number | undefined
    name: string
}

interface Row {
    category?: string
    value?: unknown
}

/** Sorts a copy of `data` with {@link sortBy}, leaving the fixture untouched. */
const sortCopy = <T extends object>(data: readonly T[], sortArguments: readonly SortArgument<T>[]): T[] =>
    data.toSorted(sortBy(sortArguments))

const toRows = (values: readonly unknown[]): Row[] => values.map((value) => ({ value }))
const valuesOf = (rows: readonly Row[]): unknown[] => rows.map((row) => row.value)

/** Binds a simple comparator to descending order. */
const descending =
    <T>(comparator: (a: T, b: T, isDescending?: boolean) => number) =>
    (a: T, b: T): number =>
        comparator(a, b, true)

const people: readonly Person[] = [
    { age: 30, name: "Charlie" },
    { age: null, name: "Alice" },
    { age: 20, name: "Bob" },
    { age: undefined, name: "Dave" },
]

describe("sortBy", () => {
    it("sorts by a single property in ascending order", () => {
        expect(sortCopy(people, ["name"]).map((person) => person.name)).toEqual(["Alice", "Bob", "Charlie", "Dave"])
    })

    it("sorts non-values (null, undefined) last in ascending order", () => {
        expect(sortCopy(people, ["age"]).map((person) => person.age)).toEqual([20, 30, null, undefined])
    })

    it('keeps non-values last in descending order ("-" prefix)', () => {
        expect(sortCopy(people, ["-age"]).map((person) => person.age)).toEqual([30, 20, null, undefined])
    })

    it("consults the next property only when the preceding one is equal", () => {
        const rows: Row[] = [
            { category: "A", value: 10 },
            { category: "B", value: 5 },
            { category: "A", value: 2 },
        ]

        expect(sortCopy(rows, ["category", "value"])).toEqual([
            { category: "A", value: 2 },
            { category: "A", value: 10 },
            { category: "B", value: 5 },
        ])
    })

    it("keeps non-values last on a descending secondary property", () => {
        const rows: Row[] = [
            { category: "A", value: 10 },
            { category: "A", value: undefined },
            { category: "A", value: 5 },
        ]

        expect(valuesOf(sortCopy(rows, ["category", "-value"]))).toEqual([10, 5, undefined])
    })

    it("keeps the original order for an empty sort argument list", () => {
        const rows = [{ id: 2 }, { id: 1 }]
        expect(sortCopy(rows, [])).toEqual(rows)
    })

    it("sorts by symbol keys", () => {
        const rank = Symbol("rank")
        const rows = [{ [rank]: 2 }, { [rank]: 1 }, { [rank]: 3 }]
        expect(sortCopy(rows, [rank]).map((row) => row[rank])).toEqual([1, 2, 3])
    })
})

describe("sortBy - numeric and mixed values", () => {
    it("compares numeric strings and numbers numerically", () => {
        expect(valuesOf(sortCopy(toRows(["10", 2, "1"]), ["value"]))).toEqual(["1", 2, "10"])
    })

    it("sorts infinite values numerically", () => {
        const values = [Number.POSITIVE_INFINITY, 0, Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY]
        expect(valuesOf(sortCopy(toRows(values), ["value"]))).toEqual([
            Number.NEGATIVE_INFINITY,
            0,
            Number.POSITIVE_INFINITY,
            Number.POSITIVE_INFINITY,
        ])
    })

    it("sorts NaN last without disturbing the order of valid numbers", () => {
        expect(valuesOf(sortCopy(toRows([5, Number.NaN, 1]), ["value"]))).toEqual([1, 5, Number.NaN])
    })

    const mixedValues: readonly unknown[] = ["b", { id: 1 }, 3, "a", "10", Number.POSITIVE_INFINITY]
    const mixedAscending: readonly unknown[] = [3, "10", Number.POSITIVE_INFINITY, "a", "b", { id: 1 }]

    it.each([
        { inputOrder: "original", values: mixedValues },
        { inputOrder: "reversed", values: mixedValues.toReversed() },
    ])("orders mixed types as numeric, string, other ($inputOrder input order)", ({ values }) => {
        expect(valuesOf(sortCopy(toRows(values), ["value"]))).toEqual(mixedAscending)
    })

    it("reverses the mixed-type order when descending", () => {
        expect(valuesOf(sortCopy(toRows(mixedValues), ["-value"]))).toEqual(mixedAscending.toReversed())
    })
})

describe("sortBy - incomparable values", () => {
    it.each([
        {
            kind: "arrays",
            values: [
                ["b", "a"],
                ["a", "c"],
                ["a", "b"],
            ],
        },
        { kind: "objects", values: [{ id: 2 }, { id: 1 }, { id: 3 }] },
    ])("treats $kind as equal and keeps their original order", ({ values }) => {
        expect(valuesOf(sortCopy(toRows(values), ["value"]))).toEqual(values)
    })

    it("returns 0 for distinct but incomparable instances", () => {
        const comparator = sortBy<{ custom: object; id: number }>(["id", "custom"])
        expect(comparator({ custom: { foo: "bar" }, id: 1 }, { custom: { foo: "bar" }, id: 1 })).toBe(0)
    })

    it("returns 0 for identical instances (referential equality fast path)", () => {
        const shared = { foo: "bar" }
        const comparator = sortBy<{ custom: object; id: number }>(["id", "custom"])
        expect(comparator({ custom: shared, id: 1 }, { custom: shared, id: 1 })).toBe(0)
    })
})

describe("simpleNumberSort", () => {
    const numbers = [10, -2, 5, 0, 3.5]
    const numbersWithNonValues = [5, null, 1, Number.NaN, undefined, 3]

    it("sorts ascending", () => {
        expect(numbers.toSorted(simpleNumberSort)).toEqual([-2, 0, 3.5, 5, 10])
    })

    it("sorts descending", () => {
        expect(numbers.toSorted(descending(simpleNumberSort))).toEqual([10, 5, 3.5, 0, -2])
    })

    it("sorts non-values (null, NaN, undefined) last in ascending order", () => {
        expect(numbersWithNonValues.toSorted(simpleNumberSort)).toEqual([1, 3, 5, null, Number.NaN, undefined])
    })

    it("keeps non-values last in descending order", () => {
        expect(numbersWithNonValues.toSorted(descending(simpleNumberSort))).toEqual([
            5,
            3,
            1,
            null,
            Number.NaN,
            undefined,
        ])
    })

    it("treats equal infinite values as equal", () => {
        expect(simpleNumberSort(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY)).toBe(0)
    })
})

describe("simpleStringSort", () => {
    const strings = ["Zebra", "apfel", "Banane"]
    const stringsWithNonValues = ["House", null, "Car", undefined]

    it("sorts ascending, locale-aware and case-insensitive", () => {
        expect(strings.toSorted(simpleStringSort)).toEqual(["apfel", "Banane", "Zebra"])
    })

    it("sorts descending", () => {
        expect(strings.toSorted(descending(simpleStringSort))).toEqual(["Zebra", "Banane", "apfel"])
    })

    it("sorts embedded numbers numerically", () => {
        expect(["a10", "a2", "a1"].toSorted(simpleStringSort)).toEqual(["a1", "a2", "a10"])
    })

    it("sorts non-values (null, undefined) last in ascending order", () => {
        expect(stringsWithNonValues.toSorted(simpleStringSort)).toEqual(["Car", "House", null, undefined])
    })

    it("keeps non-values last in descending order", () => {
        expect(stringsWithNonValues.toSorted(descending(simpleStringSort))).toEqual(["House", "Car", null, undefined])
    })
})
