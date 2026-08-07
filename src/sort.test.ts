/* oxlint-disable unicorn/no-null, typescript/non-nullable-type-assertion-style, typescript/no-non-null-assertion */

import { describe, expect, it } from "vitest"

import { simpleNumberSort, simpleStringSort, sortBy } from "./sort.js"

interface Item {
    age: null | number | undefined
    category?: string
    custom?: Record<string, unknown>
    id?: number
    metadata?: Record<string, unknown>
    name: string
    score?: number | string
    tags?: string[]
    value?: unknown
}

describe("Library Sort Functions", () => {
    describe("sortBy", () => {
        it("should sort objects by a single property in ascending order", () => {
            const data: Item[] = [
                { age: 30, name: "Charlie" },
                { age: 25, name: "Alice" },
                { age: 35, name: "Bob" },
            ]

            data.sort(sortBy(["name"]))

            expect(data).toEqual([
                { age: 25, name: "Alice" },
                { age: 35, name: "Bob" },
                { age: 30, name: "Charlie" },
            ])
        })

        it('should sort objects in descending order using the "-" prefix', () => {
            const data: Item[] = [
                { age: 25, name: "Alice" },
                { age: 35, name: "Bob" },
                { age: 30, name: "Charlie" },
            ]

            data.sort(sortBy(["-age"]))

            expect(data).toEqual([
                { age: 35, name: "Bob" },
                { age: 30, name: "Charlie" },
                { age: 25, name: "Alice" },
            ])
        })

        it("should sort by multiple properties (first equal -> second decides)", () => {
            const data = [
                { category: "A", value: 10 },
                { category: "B", value: 5 },
                { category: "A", value: 2 },
            ]

            data.sort(sortBy(["category", "value"]))

            expect(data).toEqual([
                { category: "A", value: 2 },
                { category: "A", value: 10 },
                { category: "B", value: 5 },
            ])
        })

        it("should move null and undefined values to the end", () => {
            const data: Item[] = [
                { age: 30, name: "Charlie" },
                { age: null, name: "Alice" },
                { age: 20, name: "Bob" },
                { age: undefined, name: "Dave" },
            ]

            data.sort(sortBy(["age"]))

            expect(data).toEqual([
                { age: 20, name: "Bob" },
                { age: 30, name: "Charlie" },
                { age: null, name: "Alice" },
                { age: undefined, name: "Dave" },
            ])
        })

        it('should handle null and undefined correctly even with descending ("-") prefix', () => {
            const data: Item[] = [
                { age: 30, name: "Charlie" },
                { age: null, name: "Alice" },
                { age: 20, name: "Bob" },
                { age: undefined, name: "Dave" },
            ]

            // Descending sort should still keep null/undefined at the end,
            // while sorting the valid numbers in reverse.
            data.sort(sortBy(["-age"]))

            expect(data[0]!.age).toBe(30)
            expect(data[1]!.age).toBe(20)
            expect(data[2]!.age).toBeNull()
            expect(data[3]!.age).toBeUndefined()
        })

        it("should correctly handle both numerical and string-recognised values", () => {
            const data = [{ score: "10" }, { score: 2 }, { score: "1" }]

            data.sort(sortBy(["score"]))

            expect(data).toEqual([{ score: "1" }, { score: 2 }, { score: "10" }])
        })
    })

    describe("sortBy - Edge Cases and Complex Data Types", () => {
        it("should handle arrays as property values correctly", () => {
            const data = [{ tags: ["b", "a"] }, { tags: ["a", "c"] }, { tags: ["a", "b"] }]

            data.sort(sortBy(["tags"]))

            expect(data).toBeDefined()
        })

        it("should handle nested or complex objects gracefully", () => {
            const data = [{ metadata: { id: 2 } }, { metadata: { id: 1 } }, { metadata: { id: 3 } }]

            data.sort(sortBy(["metadata"]))

            expect(data).toBeDefined()
        })

        it("should return 0 (equal) when all properties across items are identical or incomparable", () => {
            const data = [
                { custom: { foo: "bar" }, id: 1 },
                { custom: { foo: "bar" }, id: 1 },
            ]

            const comparator = sortBy(["id", "custom"])
            const result = comparator(data[0]!, data[1]!)

            expect(result).toBe(0)
        })

        it("should handle empty property names array without throwing", () => {
            const data = [{ id: 2 }, { id: 1 }]

            data.sort(sortBy([]))

            expect(data).toEqual([{ id: 2 }, { id: 1 }])
        })
    })

    describe("sortBy - Edge Cases, NaN and Regressions", () => {
        it("should handle NaN values correctly without breaking surrounding element sorting", () => {
            const data = [{ v: 5 }, { v: Number.NaN }, { v: 1 }]

            // Sorting by 'v' should not let NaN lock 5 and 1 in the wrong order
            data.sort(sortBy(["v"]))

            // Verify that valid numbers are sorted correctly (1 before 5),
            // and NaN is handled safely (e.g. pushed to the end alongside nullish values)
            expect(data[0]!.v).toBe(1)
            expect(data[1]!.v).toBe(5)
            expect(Number.isNaN(data[2]!.v)).toBe(true)
        })

        it("should correctly handle simpleNumberSort with NaN values", () => {
            const numbers = [5, Number.NaN, 1]
            numbers.sort(simpleNumberSort)

            // Ensures NaN does not corrupt the numeric sorting order of 1 and 5
            expect(numbers[0]).toBe(1)
            expect(numbers[1]).toBe(5)
            expect(Number.isNaN(numbers[2] as number)).toBe(true)
        })

        it('should correctly push null/undefined to the end even on secondary (multi-key) sort properties with descending ("-") prefix', () => {
            const data = [
                { category: "A", value: 10 },
                { category: "A", value: undefined },
                { category: "A", value: 5 },
            ]

            // Multi-key sort where the first key is identical ('A'),
            // testing if nullish handling works correctly on the secondary key ('value')
            data.sort(sortBy(["category", "-value"]))

            expect(data[0]!.value).toBe(10)
            expect(data[1]!.value).toBe(5)
            expect(data[2]!.value).toBeUndefined() // Must land at the end, not at the front
        })

        it("should hit the referential equality fast-path (a === b) when instances are identical", () => {
            const sharedObject = { foo: "bar" }
            const data = [
                { custom: sharedObject, id: 1 },
                { custom: sharedObject, id: 1 },
            ]

            const comparator = sortBy(["id", "custom"])
            const result = comparator(data[0]!, data[1]!)

            // This specifically exercises the `if (a === b) return 0` fast-path
            expect(result).toBe(0)
        })

        it("should verify order for complex types instead of just checking toBeDefined", () => {
            const data = [{ tags: ["b", "a"] }, { tags: ["a", "b"] }]

            data.sort(sortBy(["tags"]))

            expect(data[0]!.tags).toEqual(["a", "b"])
            expect(data[1]!.tags).toEqual(["b", "a"])
        })
    })

    describe("simpleNumberSort", () => {
        it("should sort pure numbers correctly", () => {
            const numbers = [10, -2, 5, 0, 3.5]
            numbers.sort(simpleNumberSort)
            expect(numbers).toEqual([-2, 0, 3.5, 5, 10])
        })

        it("should sort null and undefined to the end for numbers", () => {
            const numbers = [5, null, 1, undefined, 3]
            numbers.sort(simpleNumberSort)
            expect(numbers).toEqual([1, 3, 5, null, undefined])
        })
    })

    describe("simpleStringSort", () => {
        it("should sort strings alphabetically and localised", () => {
            const strings = ["Zebra", "apfel", "Banane"]
            strings.sort(simpleStringSort)
            expect(strings).toEqual(["apfel", "Banane", "Zebra"])
        })

        it("should sort null and undefined to the end for strings", () => {
            const strings = ["House", null, "Car", undefined]
            strings.sort(simpleStringSort)
            expect(strings).toEqual(["Car", "House", null, undefined])
        })
    })
})
