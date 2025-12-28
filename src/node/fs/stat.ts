import fs from "node:fs"
import fsPromises from "node:fs/promises"

import { putError } from "../error.js"

// ============================================================================
// File/Directory Statistics
// ============================================================================

/**
 * Gets file or directory statistics synchronously.
 * Returns undefined if an error occurs.
 *
 * @param path - Path to the file or directory.
 * @returns Stats object, or undefined on error.
 *
 * @example
 * const stats = getStatSync('/path/to/file.txt')
 * if (stats) {
 *   console.log(`Size: ${stats.size} bytes`)
 *   console.log(`Is file: ${stats.isFile()}`)
 * }
 */
export const getStatSync = (path: string): fs.Stats | undefined => {
    try {
        return fs.statSync(path, { throwIfNoEntry: false })
    } catch (error: unknown) {
        putError(error)
        return undefined
    }
}

/**
 * Gets file or directory statistics asynchronously.
 * Returns undefined if an error occurs.
 *
 * @param path - Path to the file or directory.
 * @returns Promise resolving to stats object, or undefined on error.
 *
 * @example
 * const stats = await getStatAsync('/path/to/file.txt')
 * if (stats) {
 *   console.log(`Size: ${stats.size} bytes`)
 *   console.log(`Is file: ${stats.isFile()}`)
 * }
 */
export const getStatAsync = async (path: string): Promise<fs.Stats | undefined> => {
    try {
        const stats = await fsPromises.stat(path)
        return stats
    } catch (error: unknown) {
        putError(error)
        return undefined
    }
}

/**
 * Checks if a path exists (file, directory, or symlink).
 *
 * @param path - Path to check.
 * @returns True if path exists, false otherwise.
 *
 * @example
 * if (pathExists('/path/to/something')) {
 *   console.log('Path exists')
 * }
 */
export const pathExists = (path: string): boolean => {
    return getStatSync(path) !== undefined
}

/**
 * Checks if a path exists (file, directory, or symlink) asynchronously.
 *
 * @param path - Path to check.
 * @returns Promise resolving to true if path exists, false otherwise.
 *
 * @example
 * if (await pathExistsAsync('/path/to/something')) {
 *   console.log('Path exists')
 * }
 */
export const pathExistsAsync = async (path: string): Promise<boolean> => {
    return (await getStatAsync(path)) !== undefined
}
