import type { ExecSyncOptions } from "node:child_process"

import { execFile, execFileSync, execSync } from "node:child_process"
import { promisify } from "node:util"

import { isNodeError, putError } from "./error.js"
import { defaultEncoding } from "./fs/constants.js"

const execFileAsync = promisify(execFile)

// ============================================================================
// Types
// ============================================================================

/**
 * Result of async command execution.
 */
interface AsyncCommandResult {
    error?: Error
    stderr: string
    stdout: string
    success: boolean
}

/**
 * Result of command execution.
 */
interface CommandResult {
    error?: Error
    output: string | undefined
    success: boolean
}

// ============================================================================
// Helpers
// ============================================================================

/**
 * Logs error details for command execution failures.
 */
const logCommandError = (command: string, error: unknown): void => {
    if (isNodeError(error)) {
        if (error.code === "ENOENT") {
            console.error("Command not found:", command)
            console.error("Error details:", error.message)
        } else {
            console.error("Command execution failed:", command)
            console.error("Error code:", error.code)
            console.error("Error details:", error.message)
        }
    } else {
        putError(String(error))
    }
}

// ============================================================================
// Command Execution
// ============================================================================

/**
 * Executes a command synchronously through a shell with error handling.
 * Supports shell features like pipes, redirects, and variable expansion.
 *
 * @param command - The command string to execute (e.g., "ls -la | grep node").
 * @param options - Optional execSync options.
 * @returns Command output as string, or empty string on error.
 *
 * @example
 * const output = executeCommand("ls -la")
 * console.log(output)
 *
 * @example
 * // With shell features
 * const output = executeCommand("echo $HOME && pwd", { cwd: "/tmp" })
 */
export const executeCommand = (command: string, options?: ExecSyncOptions): string => {
    try {
        return execSync(command, { ...options, encoding: defaultEncoding })
    } catch (error: unknown) {
        logCommandError(command, error)
        return ""
    }
}

/**
 * Executes a command synchronously through a shell and returns a detailed result.
 *
 * @param command - The command string to execute.
 * @param options - Optional execSync options.
 * @returns Object containing success status, output, and error if any.
 *
 * @example
 * const result = executeCommandWithResult("ls -la")
 * if (result.success) {
 *   console.log(result.output)
 * } else {
 *   console.error("Command failed:", result.error)
 * }
 */
export const executeCommandWithResult = (command: string, options?: ExecSyncOptions): CommandResult => {
    try {
        const output = execSync(command, { ...options, encoding: defaultEncoding })
        return {
            output,
            success: true,
        }
    } catch (error: unknown) {
        const errorObject = error instanceof Error ? error : new Error(String(error))

        // Log error details
        if (isNodeError(error)) {
            if (error.code === "ENOENT") {
                console.error("Command not found:", command)
            } else {
                console.error("Command execution failed:", command)
                console.error("Error code:", error.code)
            }
        }

        return {
            error: errorObject,
            output: undefined,
            success: false,
        }
    }
}

/**
 * Executes a command synchronously and returns trimmed output as string.
 * Returns empty string on error.
 *
 * @param command - The command string to execute.
 * @param options - Optional execSync options.
 * @returns Trimmed command output as string, or empty string on error.
 *
 * @example
 * const path = executeCommandString("pwd")
 * console.log("Current directory:", path)
 */
export const executeCommandString = (command: string, options?: ExecSyncOptions): string => {
    const output = executeCommand(command, options)
    return output.trim()
}

/**
 * Checks if a command exists and is executable.
 * Uses 'which' on Unix-like systems, 'where' on Windows.
 *
 * @param command - Command name to check (e.g., "git", "node").
 * @returns True if command exists, false otherwise.
 *
 * @example
 * if (commandExists("git")) {
 *   console.log("Git is available")
 * }
 */
export const commandExists = (command: string): boolean => {
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
 * Executes a command asynchronously through a shell with error handling.
 * Supports shell features like pipes, redirects, and variable expansion.
 *
 * @param command - The command string to execute.
 * @param options - Optional exec options.
 * @returns Promise resolving to trimmed command stdout, or empty string on error.
 *
 * @example
 * const output = await executeCommandAsync("ls -la")
 * console.log(output)
 *
 * @example
 * // With options and shell features
 * const output = await executeCommandAsync("pwd && echo done", { cwd: "/tmp" })
 */
export const executeCommandAsync = async (command: string, options?: ExecSyncOptions): Promise<string> => {
    try {
        const { stdout } = await execFileAsync(command, { ...options, encoding: defaultEncoding, shell: true })
        return stdout.trim()
    } catch (error: unknown) {
        logCommandError(command, error)
        return ""
    }
}

/**
 * Executes a command asynchronously through a shell and returns a detailed result.
 *
 * @param command - The command string to execute.
 * @param options - Optional exec options.
 * @returns Promise resolving to object containing success status, stdout, stderr, and error if any.
 *
 * @example
 * const result = await executeCommandAsyncWithResult("ls -la")
 * if (result.success) {
 *   console.log(result.stdout)
 * } else {
 *   console.error("Command failed:", result.error)
 *   console.error("stderr:", result.stderr)
 * }
 */
export const executeCommandAsyncWithResult = async (
    command: string,
    options?: ExecSyncOptions,
): Promise<AsyncCommandResult> => {
    try {
        const { stderr, stdout } = await execFileAsync(command, { ...options, encoding: defaultEncoding, shell: true })
        return {
            stderr: stderr.trim(),
            stdout: stdout.trim(),
            success: true,
        }
    } catch (error: unknown) {
        const errorObject = error instanceof Error ? error : new Error(String(error))

        // Extract stdout/stderr from exec error if available
        let stdout = ""
        let stderr = ""
        if (
            error &&
            typeof error === "object" &&
            "stdout" in error &&
            "stderr" in error &&
            typeof error.stdout === "string" &&
            typeof error.stderr === "string"
        ) {
            stdout = error.stdout
            stderr = error.stderr
        }

        // Log error details
        if (isNodeError(error)) {
            if (error.code === "ENOENT") {
                console.error("Command not found:", command)
            } else {
                console.error("Command execution failed:", command)
                console.error("Error code:", error.code)
            }
        }

        return {
            error: errorObject,
            stderr: stderr.trim(),
            stdout: stdout.trim(),
            success: false,
        }
    }
}

/**
 * Checks if a command exists asynchronously.
 * Uses 'which' on Unix-like systems, 'where' on Windows.
 *
 * @param command - Command name to check (e.g., "git", "node").
 * @returns Promise resolving to true if command exists, false otherwise.
 *
 * @example
 * if (await commandExistsAsync("git")) {
 *   console.log("Git is available")
 * }
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
