import type { Result } from "@/result.js"

import { err, isOk, ok } from "@/result.js"
import fs from "node:fs"
import fsPromises from "node:fs/promises"

import type { FileSystemError } from "../error.js"

import { toFileSystemError } from "../error.js"
import { getStatSync } from "./stat.js"

// ============================================================================
// File Removal
// ============================================================================

/**
 * Removes a file synchronously. Not finding the file counts as success (nothing to remove), not a `FileSystemError`.
 *
 * @example
 *     const result = removeFileSync("temp.txt")
 *     if (!result.ok) {
 *         console.error(result.error)
 *     }
 *
 * @param fileName - Path to the file to remove.
 * @returns `Result`, empty on success, or a `FileSystemError` for anything other than "not found".
 */
export const removeFileSync = (fileName: string): Result<void, FileSystemError> => {
    try {
        fs.rmSync(fileName, { force: true })
        return ok(undefined)
    } catch (error: unknown) {
        return err(toFileSystemError(error, fileName))
    }
}

/**
 * Removes a file asynchronously. Async version of removeFileSync. Not finding the file counts as success.
 *
 * @example
 *     const result = await removeFileAsync("temp.txt")
 *     if (!result.ok) {
 *         console.error(result.error)
 *     }
 *
 * @param fileName - Path to the file to remove.
 * @returns `Result`, empty on success, or a `FileSystemError` for anything other than "not found".
 */
export const removeFileAsync = async (fileName: string): Promise<Result<void, FileSystemError>> => {
    try {
        await fsPromises.rm(fileName, { force: true })
        return ok(undefined)
    } catch (error: unknown) {
        return err(toFileSystemError(error, fileName))
    }
}

// ============================================================================
// File Existence and Properties
// ============================================================================

/**
 * Checks if a path exists and is a regular file (not a directory or symlink).
 *
 * @example
 *     if (doesFileExist("config.json")) {
 *         console.log("Config file found")
 *     }
 *
 * @param fileName - Path to check.
 * @returns True if path exists and is a file, false otherwise.
 */
export const doesFileExist = (fileName: string): boolean => {
    const result = getStatSync(fileName)
    return isOk(result) && result.value.isFile()
}

/**
 * Checks if a file exists and is empty (zero bytes).
 *
 * @example
 *     if (isFileEmpty("log.txt")) {
 *         console.log("Log file is empty")
 *     }
 *
 * @param fileName - Path to check.
 * @returns True if file exists and has zero bytes, false if missing or has content.
 */
export const isFileEmpty = (fileName: string): boolean => {
    const stat = fs.statSync(fileName, { throwIfNoEntry: false })
    return stat?.size === 0
}

/**
 * Checks if a path exists and is a regular file (not a directory or symlink). Async version of doesFileExist.
 *
 * @example
 *     if (await doesFileExistAsync("config.json")) {
 *         console.log("Config file found")
 *     }
 *
 * @param fileName - Path to check.
 * @returns Promise resolving to true if path exists and is a file, false otherwise.
 */
export const doesFileExistAsync = async (fileName: string): Promise<boolean> => {
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
 * @example
 *     const size = getFileSize("data.json")
 *     if (size !== undefined) {
 *         console.log(`File size: ${size} bytes`)
 *     }
 *
 * @param fileName - Path to the file.
 * @returns File size in bytes, or undefined if file doesn't exist or error occurs.
 */
export const getFileSize = (fileName: string): number | undefined => {
    const result = getStatSync(fileName)
    return isOk(result) ? result.value.size : undefined
}
