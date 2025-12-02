import type { Rule } from "eslint"

import { execSync } from "node:child_process"
import fs from "node:fs"

export default {
    create(context: Rule.RuleContext): Rule.RuleListener {
        const filename = context.filename
        // Normalize both paths to forward slashes for cross-platform reliability
        const normalized = filename.replaceAll("\\", "/")
        if (!normalized.endsWith("src/index.ts")) return {}

        return {
            Program(node): void {
                try {
                    const cwd = context.cwd
                    const expected = execSync("tsx --no-warnings scripts/generate-barrel.mts --dry-run", {
                        cwd,
                        encoding: "utf8",
                        stdio: ["pipe", "pipe", "ignore"],
                    }).trim()
                    const actual = fs.readFileSync(filename, "utf8").trim()

                    if (expected !== actual) {
                        context.report({
                            fix(fixer) {
                                const sourceCode = context.sourceCode
                                return fixer.replaceTextRange([0, sourceCode.text.length], expected)
                            },
                            message: "src/index.ts is stale. Run npm run barrel.",
                            node,
                        })
                    }
                } catch {
                    // Silent in-editor; CI will fail properly
                }
            },
        }
    },
    meta: {
        docs: {
            description: "Ensure src/index.ts is freshly generated",
        },
        fixable: "code",
        schema: [],
        type: "problem",
    },
} satisfies Rule.RuleModule
