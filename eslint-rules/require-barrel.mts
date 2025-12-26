import type { AST, Rule } from "eslint"

import { execSync } from "node:child_process"
import fs from "node:fs"
import path from "node:path"

export default {
    create(context: Rule.RuleContext): Rule.RuleListener {
        const filename = context.filename
        const normalized = filename.replaceAll("\\", "/")

        // 1. Check if the file is one of our generated barrels
        if (
            !normalized.endsWith("src/index.ts") &&
            !normalized.endsWith("src/na.ts") &&
            !normalized.endsWith("src/node.ts")
        ) {
            return {}
        }

        return {
            Program(node: AST.Program): void {
                try {
                    const cwd = context.cwd
                    // 2. Determine which target we are checking (index.ts or node.ts)
                    const targetFile = path.basename(normalized)

                    // 3. Pass the --target flag to the script
                    const expected = execSync(
                        `tsx --no-warnings scripts/generate-barrel.mts --dry-run --target=${targetFile}`,
                        {
                            cwd,
                            encoding: "utf8",
                            stdio: ["pipe", "pipe", "ignore"],
                        },
                    ).trim()

                    const actual = fs.readFileSync(filename, "utf8").trim()

                    if (expected !== actual) {
                        context.report({
                            fix(fixer) {
                                const sourceCode = context.sourceCode
                                return fixer.replaceTextRange([0, sourceCode.text.length], expected)
                            },
                            // 4. Update message to be generic
                            message: `${targetFile} is stale. Run npm run barrel.`,
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
            description: "Ensure barrel files are freshly generated",
        },
        fixable: "code",
        schema: [],
        type: "problem",
    },
} satisfies Rule.RuleModule
