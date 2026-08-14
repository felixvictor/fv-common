import type { ExecSyncOptions } from "node:child_process"

import { execFile, execFileSync, execSync } from "node:child_process"
import { promisify } from "node:util"

import type { Result } from "../result.js"

import { err, ok } from "../result.js"
import { defaultEncoding } from "./fs/constants.js"

const execFileAsync = promisify(execFile)

// ============================================================================
// Types
// ============================================================================

/** Failure of a shell command, returned as the `error` of a `Result`. `stderr` is present when the process produced it. */
export interface CommandError {
    readonly cause: unknown
    readonly command: string
    readonly stderr?: string
}

// ============================================================================
// Helpers
// ============================================================================

/** Builds a `CommandError` from a caught error, extracting `stderr` if the error object carries it. */
const toCommandError = (command: string, error: unknown): CommandError => {
    const hasStderr =
        error !== null && typeof error === "object" && "stderr" in error && typeof error.stderr === "string"
    return hasStderr
        ? { cause: error, command, stderr: (error as { stderr: string }).stderr }
        : { cause: error, command }
}

// ============================================================================
// Command Execution
// ============================================================================

/**
 * Executes a command synchronously through a shell. Supports shell features like pipes, redirects, and variable
 * expansion.
 *
 * @example
 *     const result = executeCommand("ls -la")
 *     if (result.ok) {
 *         console.log(result.value)
 *     }
 *
 * @example
 *     // With shell features
 *     const result = executeCommand("echo $HOME && pwd", { cwd: "/tmp" })
 *
 * @param command - The command string to execute (e.g., "ls -la | grep node").
 * @param options - Optional execSync options.
 * @returns `Result` with the command output, or a `CommandError`.
 */
export const executeCommand = (command: string, options?: ExecSyncOptions): Result<string, CommandError> => {
    try {
        return ok(execSync(command, { ...options, encoding: defaultEncoding }))
    } catch (error: unknown) {
        return err(toCommandError(command, error))
    }
}

/**
 * Executes a command synchronously through a shell and returns trimmed output.
 *
 * @example
 *     const result = executeCommandString("pwd")
 *     if (result.ok) {
 *         console.log("Current directory:", result.value)
 *     }
 *
 * @param command - The command string to execute.
 * @param options - Optional execSync options.
 * @returns `Result` with the trimmed command output, or a `CommandError`.
 */
export const executeCommandString = (command: string, options?: ExecSyncOptions): Result<string, CommandError> => {
    const result = executeCommand(command, options)
    return result.ok ? ok(result.value.trim()) : result
}

/**
 * Checks if a command exists and is executable. Uses 'which' on Unix-like systems, 'where' on Windows.
 *
 * @example
 *     if (doesCommandExist("git")) {
 *         console.log("Git is available")
 *     }
 *
 * @param command - Command name to check (e.g., "git", "node").
 * @returns True if command exists, false otherwise.
 */
export const doesCommandExist = (command: string): boolean => {
    try {
        const checkCommand = process.platform === "win32" ? "where" : "which"
        execFileSync(checkCommand, [command], { stdio: "ignore" })
        return true
    } catch {
        return false
    }
}

// ============================================================================
// Async Command Execution
// ============================================================================

/**
 * Executes a command asynchronously through a shell. Supports shell features like pipes, redirects, and variable
 * expansion.
 *
 * @example
 *     const result = await executeCommandAsync("ls -la")
 *     if (result.ok) {
 *         console.log(result.value)
 *     }
 *
 * @example
 *     // With options and shell features
 *     const result = await executeCommandAsync("pwd && echo done", { cwd: "/tmp" })
 *
 * @param command - The command string to execute.
 * @param options - Optional exec options.
 * @returns Promise resolving to a `Result` with the trimmed command stdout, or a `CommandError`.
 */
export const executeCommandAsync = async (
    command: string,
    options?: ExecSyncOptions,
): Promise<Result<string, CommandError>> => {
    try {
        const { stdout } = await execFileAsync(command, { ...options, encoding: defaultEncoding, shell: true })
        return ok(stdout.trim())
    } catch (error: unknown) {
        return err(toCommandError(command, error))
    }
}

/**
 * Checks if a command exists asynchronously. Uses 'which' on Unix-like systems, 'where' on Windows.
 *
 * @example
 *     if (await commandExistsAsync("git")) {
 *         console.log("Git is available")
 *     }
 *
 * @param command - Command name to check (e.g., "git", "node").
 * @returns Promise resolving to true if command exists, false otherwise.
 */
export const commandExistsAsync = async (command: string): Promise<boolean> => {
    try {
        const checkCommand = process.platform === "win32" ? "where" : "which"
        await execFileAsync(checkCommand, [command])
        return true
    } catch {
        return false
    }
}
