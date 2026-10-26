import { describe, expect, it } from "vitest"

import { escapeHtml } from "./text.js"

describe("escapeHtml", () => {
    it("escapes markup and quotes", () => {
        expect(escapeHtml(`<a href="x" title='y'>&</a>`)).toBe(
            "&lt;a href=&quot;x&quot; title=&#39;y&#39;&gt;&amp;&lt;/a&gt;",
        )
    })

    it("leaves other text unchanged", () => {
        expect(escapeHtml("Blick zurück – 14:10")).toBe("Blick zurück – 14:10")
    })
})
