import fs from "node:fs"
import fsPromises from "node:fs/promises"

import { putError } from "../error.js"

const fileSystemOptions = {
    force: true,
    throwIfNoEntry: false,
} as const

/**
 * Removes a file. Does nothing if file doesn't exist (force: true).
 */
export const removeFileSync = (fileName: string): void => {
    fs.rmSync(fileName, { force: fileSystemOptions.force })
}

/**
 * Async version of removeFileSync.
 * Logs error but doesn't throw on failure.
 */
export const removeFileAsync = async (fileName: string): Promise<void> => {
    try {
        await fsPromises.rm(fileName, { force: fileSystemOptions.force })
    } catch (error: unknown) {
        putError(error)
    }
}

// --- File Existence and Stats ---

/**
 * Checks if a file exists and is a regular file (not a directory).
 * @returns true if file exists, false otherwise
 */
export const fileExists = (fileName: string): boolean => {
    try {
        const stat = fs.statSync(fileName)
        return stat.isFile()
    } catch {
        return false
    }
}

/**
 * Checks if a file exists and has zero bytes.
 * @returns true if file exists and is empty, false if missing or has content
 */
export const fileEmpty = (fileName: string): boolean => {
    const stat = fs.statSync(fileName, { throwIfNoEntry: fileSystemOptions.throwIfNoEntry })
    return stat?.size === 0
}

/**
 * Async version of fileExists.
 * Checks if path exists and is a regular file.
 */
export const fileExistsAsync = async (fileName: string): Promise<boolean> => {
    try {
        const stats = await fsPromises.stat(fileName)
        return stats.isFile()
    } catch {
        return false
    }
}
