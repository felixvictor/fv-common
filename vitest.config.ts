import path from "node:path"
import { defineConfig } from "vitest/config"

// Fixed system time zone for date tests; set before the test workers start so that ICU picks it up
const testTimeZone = "Europe/Berlin"
process.env["TZ"] = testTimeZone

export default defineConfig({
    resolve: {
        alias: { "@": path.resolve(import.meta.dirname, "src") },
    },
    test: {
        environment: "node",
        include: ["src/**/*.test.ts"],
    },
})
