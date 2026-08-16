import type { UserConfig } from "@commitlint/types"

import { RuleConfigSeverity } from "@commitlint/types"

import { commitTypes } from "./changelog.config.js"

const validTypes = Object.keys(commitTypes)

const config: UserConfig = {
    extends: ["@commitlint/config-conventional"],
    rules: {
        "subject-case": [RuleConfigSeverity.Error, "never", ["start-case", "pascal-case", "upper-case"]],
        "type-enum": [RuleConfigSeverity.Error, "always", validTypes],
    },
}

export default config
