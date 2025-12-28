import fs from "node:fs"
import fsPromises from "node:fs/promises"

import { putError } from "../error.js"
import { getStatSync } from "./stat.js"

// ============================================================================
// Constants
// ============================================================================

const fileSystemOptions = {
    force: true,
    throwIfNoEntry: false,
} as const

// ============================================================================
// File Removal
// ============================================================================

/**
 * Removes a file synchronously.
 * Does nothing if file doesn't exist (no error thrown).
 *
 * @param fileName - Path to the file to remove.
 *
 * @example
 * removeFileSync("temp.txt")
 */
export const removeFileSync = (fileName: string): void => {
    fs.rmSync(fileName, { force: fileSystemOptions.force })
}

/**
 * Removes a file asynchronously.
 * Logs error but doesn't throw on failure.
 *
 * @param fileName - Path to the file to remove.
 *
 * @example
 * await removeFileAsync("temp.txt")
 */
export const removeFileAsync = async (fileName: string): Promise<void> => {
    try {
        await fsPromises.rm(fileName, { force: fileSystemOptions.force })
    } catch (error: unknown) {
        putError(error)
    }
}

// ============================================================================
// File Existence and Properties
// ============================================================================

/**
 * Checks if a path exists and is a regular file (not a directory or symlink).
 *
 * @param fileName - Path to check.
 * @returns True if path exists and is a file, false otherwise.
 *
 * @example
 * if (fileExists("config.json")) {
 *   console.log("Config file found")
 * }
 */
export const fileExists = (fileName: string): boolean => {
    const stat = getStatSync(fileName)
    return stat?.isFile() === true
}

/**
 * Checks if a file exists and is empty (zero bytes).
 *
 * @param fileName - Path to check.
 * @returns True if file exists and has zero bytes, false if missing or has content.
 *
 * @example
 * if (fileEmpty("log.txt")) {
 *   console.log("Log file is empty")
 * }
 */
export const fileEmpty = (fileName: string): boolean => {
    const stat = fs.statSync(fileName, { throwIfNoEntry: fileSystemOptions.throwIfNoEntry })
    return stat?.size === 0
}

/**
 * Checks if a path exists and is a regular file (not a directory or symlink).
 * Async version of fileExists.
 *
 * @param fileName - Path to check.
 * @returns Promise resolving to true if path exists and is a file, false otherwise.
 *
 * @example
 * if (await fileExistsAsync("config.json")) {
 *   console.log("Config file found")
 * }
 */
export const fileExistsAsync = async (fileName: string): Promise<boolean> => {
    try {
        const stats = await fsPromises.stat(fileName)
        return stats.isFile()
    } catch {
        return false
    }
}

/**
 * Gets the size of a file in bytes.
 *
 * @param fileName - Path to the file.
 * @returns File size in bytes, or undefined if file doesn't exist or error occurs.
 *
 * @example
 * const size = getFileSize("data.json")
 * if (size !== undefined) {
 *   console.log(`File size: ${size} bytes`)
 * }
 */
export const getFileSize = (fileName: string): number | undefined => {
    const stat = getStatSync(fileName)
    return stat?.size
}
