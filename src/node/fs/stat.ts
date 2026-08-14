import type { Result } from "@/result.js"

import { err, isOk, ok } from "@/result.js"
import fs from "node:fs"
import fsPromises from "node:fs/promises"

import type { FileSystemError } from "../error.js"

import { toFileSystemError } from "../error.js"

// ============================================================================
// File/Directory Statistics
// ============================================================================

/**
 * Gets file or directory statistics synchronously.
 *
 * @example
 *     const result = getStatSync("/path/to/file.txt")
 *     if (result.ok) {
 *         console.log(`Size: ${result.value.size} bytes`)
 *     }
 *
 * @param path - Path to the file or directory.
 * @returns `Result` with the `fs.Stats`, or a `FileSystemError` (`kind: "not-found"` if the path doesn't exist).
 */
export const getStatSync = (path: string): Result<fs.Stats, FileSystemError> => {
    try {
        return ok(fs.statSync(path))
    } catch (error: unknown) {
        return err(toFileSystemError(error, path))
    }
}

/**
 * Gets file or directory statistics asynchronously.
 *
 * @example
 *     const result = await getStatAsync("/path/to/file.txt")
 *     if (result.ok) {
 *         console.log(`Size: ${result.value.size} bytes`)
 *     }
 *
 * @param path - Path to the file or directory.
 * @returns Promise resolving to a `Result` with the `fs.Stats`, or a `FileSystemError`.
 */
export const getStatAsync = async (path: string): Promise<Result<fs.Stats, FileSystemError>> => {
    try {
        return ok(await fsPromises.stat(path))
    } catch (error: unknown) {
        return err(toFileSystemError(error, path))
    }
}

/**
 * Checks if a path exists (file, directory, or symlink).
 *
 * @example
 *     if (doesPathExist("/path/to/something")) {
 *         console.log("Path exists")
 *     }
 *
 * @param path - Path to check.
 * @returns True if path exists, false otherwise.
 */
export const doesPathExist = (path: string): boolean => {
    return isOk(getStatSync(path))
}

/**
 * Checks if a path exists (file, directory, or symlink) asynchronously.
 *
 * @example
 *     if (await doesPathExistAsync("/path/to/something")) {
 *         console.log("Path exists")
 *     }
 *
 * @param path - Path to check.
 * @returns Promise resolving to true if path exists, false otherwise.
 */
export const doesPathExistAsync = async (path: string): Promise<boolean> => {
    return isOk(await getStatAsync(path))
}
