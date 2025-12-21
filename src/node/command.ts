import type { ExecOptions, ExecSyncOptions } from "node:child_process"

import { exec, execSync } from "node:child_process"
import { promisify } from "node:util"

import { isNodeError, putError } from "./error.js"

const execAsync = promisify(exec)

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
    output: Buffer | undefined
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
 * Executes a shell command synchronously with error handling.
 *
 * @param command - The shell command to execute.
 * @param options - Optional execSync options.
 * @returns Buffer containing command output, or empty Buffer on error.
 *
 * @example
 * const output = executeCommand("ls -la")
 * console.log(output.toString())
 *
 * @example
 * // With options
 * const output = executeCommand("pwd", { cwd: "/tmp" })
 */
export const executeCommand = (command: string, options?: ExecSyncOptions): Buffer => {
    try {
        const result = execSync(command, { ...options, encoding: undefined })
        return result
    } catch (error: unknown) {
        logCommandError(command, error)
        return Buffer.from("")
    }
}

/**
 * Executes a shell command synchronously and returns a detailed result.
 *
 * @param command - The shell command to execute.
 * @param options - Optional execSync options.
 * @returns Object containing success status, output, and error if any.
 *
 * @example
 * const result = executeCommandWithResult("ls -la")
 * if (result.success) {
 *   console.log(result.output?.toString())
 * } else {
 *   console.error("Command failed:", result.error)
 * }
 */
export const executeCommandWithResult = (command: string, options?: ExecSyncOptions): CommandResult => {
    try {
        const output = execSync(command, { ...options, encoding: undefined })
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
 * Executes a shell command synchronously and returns output as string.
 * Returns empty string on error.
 *
 * @param command - The shell command to execute.
 * @param options - Optional execSync options.
 * @returns Command output as string, or empty string on error.
 *
 * @example
 * const path = executeCommandString("pwd")
 * console.log("Current directory:", path.trim())
 */
export const executeCommandString = (command: string, options?: ExecSyncOptions): string => {
    const output = executeCommand(command, options)
    return output.toString().trim()
}

/**
 * Checks if a command exists and is executable.
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
        // Use 'which' on Unix-like systems, 'where' on Windows
        const checkCommand = process.platform === "win32" ? "where" : "which"
        execSync(`${checkCommand} ${command}`, { stdio: "ignore" })
        return true
    } catch {
        return false
    }
}

// ============================================================================
// Async Command Execution
// ============================================================================

/**
 * Executes a shell command asynchronously with error handling.
 *
 * @param command - The shell command to execute.
 * @param options - Optional exec options.
 * @returns Promise resolving to command stdout, or empty string on error.
 *
 * @example
 * const output = await executeCommandAsync("ls -la")
 * console.log(output)
 *
 * @example
 * // With options
 * const output = await executeCommandAsync("pwd", { cwd: "/tmp" })
 */
export const executeCommandAsync = async (command: string, options?: ExecOptions): Promise<string> => {
    try {
        const { stdout } = await execAsync(command, { ...options, encoding: "utf8" })
        return stdout.trim()
    } catch (error: unknown) {
        logCommandError(command, error)
        return ""
    }
}

/**
 * Executes a shell command asynchronously and returns a detailed result.
 *
 * @param command - The shell command to execute.
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
    options?: ExecOptions,
): Promise<AsyncCommandResult> => {
    try {
        const { stderr, stdout } = await execAsync(command, { ...options, encoding: "utf8" })
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
        // Use 'which' on Unix-like systems, 'where' on Windows
        const checkCommand = process.platform === "win32" ? "where" : "which"
        await execAsync(`${checkCommand} ${command}`)
        return true
    } catch {
        return false
    }
}
