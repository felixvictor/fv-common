import { defineConfig, type UserConfig } from "tsdown"

import { entryFiles } from "./scripts/barrels.ts"

const sharedConfig = {
    format: "esm",
    minify: true,
    platform: "neutral",
    sourcemap: true,
    target: false,
    treeshake: true,
    tsconfig: "./tsconfig.browser.json",
} as const satisfies UserConfig

const entryOverrides: Readonly<Record<string, UserConfig>> = {
    index: { platform: "browser" },
    // platform "node" implies fixed extensions (.mjs, .d.mts)
    node: { platform: "node", tsconfig: "./tsconfig.node.json" },
}

export default defineConfig(
    Object.entries(entryFiles).map(([entryName, entryFile]) => ({
        ...sharedConfig,
        entry: { [entryName]: entryFile },
        ...entryOverrides[entryName],
    })),
)
