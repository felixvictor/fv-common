import type { ChangelogConfig } from "changelogen"

export const commitTypes: ChangelogConfig["types"] = {
    build: { semver: "patch", title: "📦 Build" },
    chore: { title: "🏡 Chore" },
    ci: { title: "🤖 CI" },
    docs: { semver: "patch", title: "📖 Documentation" },
    examples: { title: "🏀 Examples" },
    feat: { semver: "minor", title: "🚀 Enhancements" },
    fix: { semver: "patch", title: "🩹 Fixes" },
    perf: { semver: "patch", title: "🔥 Performance" },
    refactor: { semver: "patch", title: "💅 Refactors" },
    revert: { semver: "patch", title: "⏪ Reverts" },
    style: { title: "🎨 Styles" },
    test: { title: "✅ Tests" },
    types: { semver: "patch", title: "🌊 Types" },
} as const

const config: Partial<ChangelogConfig> = {
    noAuthors: true,
    types: commitTypes,
}

export default config
