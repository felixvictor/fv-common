import { describe, expect, it } from "vitest"

import { getTone } from "./tone.js"

describe("getTone", () => {
    it("measures black, white and mid grey", () => {
        expect(getTone("#000000")).toBeCloseTo(0, 6)
        expect(getTone("#ffffff")).toBeCloseTo(100, 6)
        expect(getTone("#777777")).toBeCloseTo(50, 0)
    })

    it("depends on luminance only", () => {
        expect(getTone("#ff0000")).toBeCloseTo(53.2, 1)
        expect(getTone("#0000ff")).toBeCloseTo(32.3, 1)
    })
})
