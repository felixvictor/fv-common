import { defineConfig } from "tsdown"

import { entryFiles } from "./scripts/barrels.ts"

/**
 * All entry points are bundled in a single build. Modules used by several entry points (e.g. the locale state in
 * `src/locale.ts`) are emitted once as shared chunks, so every entry point works on the same module instance. `exports`
 * keeps the package.json `exports` map in sync with the entries.
 */
export default defineConfig({
    // Node built-ins are imported by the node entry only and always stay external
    deps: { neverBundle: [/^node:/] },
    entry: entryFiles,
    exports: true,
    fixedExtension: false,
    format: "esm",
    minify: true,
    platform: "neutral",
    sourcemap: true,
    target: false,
    treeshake: true,
    tsconfig: "./tsconfig.build.json",
})
