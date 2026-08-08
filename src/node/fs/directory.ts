import fs from "node:fs"
import fsPromises from "node:fs/promises"

import { putError } from "../error.js"
import { getStatSync } from "./stat.js"

// ============================================================================
// Directory Creation
// ============================================================================

/**
 * Creates a directory synchronously, including parent directories if needed. Logs error but doesn't throw on failure.
 *
 * @example
 *     makeDirectorySync("data/logs/2024")
 *
 * @param directory - Path to the directory to create.
 */
export const makeDirectorySync = (directory: string): void => {
    try {
        fs.mkdirSync(directory, { recursive: true })
    } catch (error: unknown) {
        putError(`Cannot create directory ${directory}\nError: ${String(error)}`)
    }
}

/**
 * Creates a directory asynchronously, including parent directories if needed. Logs error but doesn't throw on failure.
 *
 * @example
 *     await makeDirectoryAsync("data/logs/2024")
 *
 * @param directory - Path to the directory to create.
 */
export const makeDirectoryAsync = async (directory: string): Promise<void> => {
    try {
        await fsPromises.mkdir(directory, { recursive: true })
    } catch (error: unknown) {
        putError(`Cannot create directory ${directory}\nError: ${String(error)}`)
    }
}

// ============================================================================
// Directory Reading
// ============================================================================

/**
 * Reads directory contents recursively, returning all files and subdirectories.
 *
 * @example
 *     const allFiles = readDirectorySync("src")
 *     // Returns: ["index.ts", "utils/helper.ts", "utils/config.ts", ...]
 *
 * @param directoryPath - Path to the directory to read.
 * @returns Array of relative paths to all files and directories within.
 */
export const readDirectorySync = (directoryPath: string): string[] => {
    return fs.readdirSync(directoryPath, { recursive: true }) as string[]
}

/**
 * Reads directory contents recursively, returning all files and subdirectories as Dirent entries (with type info such
 * as isFile()/isDirectory(), unlike the plain path strings from readDirectorySync).
 *
 * @example
 *     const entries = readDirectoryEntriesSync("src")
 *     const files = entries.filter((entry) => entry.isFile())
 *
 * @param directoryPath - Path to the directory to read.
 * @returns Array of Dirent entries for all files and directories within.
 */
export const readDirectoryEntriesSync = (directoryPath: string): fs.Dirent[] => {
    return fs.readdirSync(directoryPath, { recursive: true, withFileTypes: true })
}

/**
 * Reads directory contents recursively, returning all files and subdirectories. Async version of readDirectorySync.
 *
 * @example
 *     const allFiles = await readDirectoryAsync("src")
 *
 * @param directoryPath - Path to the directory to read.
 * @returns Promise resolving to array of relative paths.
 */
export const readDirectoryAsync = async (directoryPath: string): Promise<string[]> => {
    return await fsPromises.readdir(directoryPath, { recursive: true })
}

/**
 * Reads directory contents recursively, returning all files and subdirectories as Dirent entries. Async version of
 * readDirectoryEntriesSync.
 *
 * @example
 *     const entries = await readDirectoryEntriesAsync("src")
 *     const files = entries.filter((entry) => entry.isFile())
 *
 * @param directoryPath - Path to the directory to read.
 * @returns Promise resolving to array of Dirent entries for all files and directories within.
 */
export const readDirectoryEntriesAsync = async (directoryPath: string): Promise<fs.Dirent[]> => {
    return await fsPromises.readdir(directoryPath, { recursive: true, withFileTypes: true })
}

/**
 * Reads immediate directory contents only (non-recursive). Does not traverse subdirectories.
 *
 * @example
 *     const files = readDirectoryNotRecursive("src")
 *     // Returns: ["index.ts", "utils", "components"] (no nested paths)
 *
 * @param directoryPath - Path to the directory to read.
 * @returns Array of file and directory names in the immediate directory.
 */
export const readDirectoryNotRecursive = (directoryPath: string): string[] => {
    return fs.readdirSync(directoryPath, { recursive: false }) as string[]
}

/**
 * Reads immediate directory contents only (non-recursive). Async version of readDirectoryNotRecursive.
 *
 * @example
 *     const files = await readDirectoryNotRecursiveAsync("src")
 *
 * @param directoryPath - Path to the directory to read.
 * @returns Promise resolving to array of file and directory names.
 */
export const readDirectoryNotRecursiveAsync = async (directoryPath: string): Promise<string[]> => {
    return await fsPromises.readdir(directoryPath, { recursive: false })
}

// ============================================================================
// Directory Removal
// ============================================================================

/**
 * Removes a directory and all its contents recursively. Does nothing if directory doesn't exist (no error thrown).
 *
 * @example
 *     removeDirectorySync("temp/build")
 *
 * @param directoryPath - Path to the directory to remove.
 */
export const removeDirectorySync = (directoryPath: string): void => {
    fs.rmSync(directoryPath, { force: true, recursive: true })
}

/**
 * Removes a directory and all its contents recursively. Does nothing if directory doesn't exist (no error thrown).
 * Async version of removeDirectorySync.
 *
 * @example
 *     await removeDirectoryAsync("temp/build")
 *
 * @param directoryPath - Path to the directory to remove.
 */
export const removeDirectoryAsync = async (directoryPath: string): Promise<void> => {
    await fsPromises.rm(directoryPath, { force: true, recursive: true })
}

// ============================================================================
// Directory Existence
// ============================================================================

/**
 * Checks if a path exists and is a directory (not a file).
 *
 * @example
 *     if (directoryExists("data/logs")) {
 *         console.log("Logs directory exists")
 *     }
 *
 * @param directoryPath - Path to check.
 * @returns True if path exists and is a directory, false otherwise.
 */
export const doesDirectoryExist = (directoryPath: string): boolean => {
    const stat = getStatSync(directoryPath)
    return stat?.isDirectory() === true
}

/**
 * Checks if a path exists and is a directory (not a file). Async version of doesDirectoryExist.
 *
 * @example
 *     if (await directoryExistsAsync("data/logs")) {
 *         console.log("Logs directory exists")
 *     }
 *
 * @param directoryPath - Path to check.
 * @returns Promise resolving to true if path exists and is a directory, false otherwise.
 */
export const doesDirectoryExistAsync = async (directoryPath: string): Promise<boolean> => {
    try {
        const stats = await fsPromises.stat(directoryPath)
        return stats.isDirectory()
    } catch {
        return false
    }
}
