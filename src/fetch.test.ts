import { afterEach, describe, expect, it, vi } from "vitest"

import { loadFile } from "./fetch.js"

describe("loadFile", () => {
    afterEach(() => {
        vi.unstubAllGlobals()
    })

    it("passes init to fetch and parses the JSON body", async () => {
        const fetchMock = vi.fn(async () => Response.json({ answer: 42 }))
        vi.stubGlobal("fetch", fetchMock)
        const init = { headers: { Accept: "application/json" } }

        await expect(loadFile("https://example.com/data.json", init)).resolves.toEqual({ answer: 42 })
        expect(fetchMock).toHaveBeenCalledWith("https://example.com/data.json", init)
    })

    it("rejects on a non-2xx status", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn(async () => new Response("Forbidden", { status: 403, statusText: "Forbidden" })),
        )

        await expect(loadFile("https://example.com/data.json")).rejects.toThrow("status 403")
    })

    it("rejects if the body is not JSON", async () => {
        vi.stubGlobal(
            "fetch",
            vi.fn(async () => new Response("<!DOCTYPE html>", { status: 200 })),
        )

        await expect(loadFile("https://example.com/data.json")).rejects.toThrow(SyntaxError)
    })
})
