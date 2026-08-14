import type { Result } from "@/result.js"

import { err, isOk, ok } from "@/result.js"
import fs from "node:fs"
import fsPromises from "node:fs/promises"

import type { FileSystemError } from "../error.js"

import { toFileSystemError } from "../error.js"
import { getStatAsync, getStatSync } from "./stat.js"

// ============================================================================
// Directory Creation
// ============================================================================

/**
 * Creates a directory synchronously, including parent directories if needed.
 *
 * @example
 *     const result = makeDirectorySync("data/logs/2024")
 *     if (!result.ok) {
 *         console.error(result.error)
 *     }
 *
 * @param directory - Path to the directory to create.
 * @returns `Result`, empty on success, or a `FileSystemError`.
 */
export const makeDirectorySync = (directory: string): Result<void, FileSystemError> => {
    try {
        fs.mkdirSync(directory, { recursive: true })
        return ok(undefined)
    } catch (error: unknown) {
        return err(toFileSystemError(error, directory))
    }
}

/**
 * Creates a directory asynchronously, including parent directories if needed.
 *
 * @example
 *     const result = await makeDirectoryAsync("data/logs/2024")
 *     if (!result.ok) {
 *         console.error(result.error)
 *     }
 *
 * @param directory - Path to the directory to create.
 * @returns `Result`, empty on success, or a `FileSystemError`.
 */
export const makeDirectoryAsync = async (directory: string): Promise<Result<void, FileSystemError>> => {
    try {
        await fsPromises.mkdir(directory, { recursive: true })
        return ok(undefined)
    } catch (error: unknown) {
        return err(toFileSystemError(error, directory))
    }
}

// ============================================================================
// Directory Reading
// ============================================================================

/**
 * Reads directory contents recursively, returning all files and subdirectories.
 *
 * @example
 *     const result = readDirectorySync("src")
 *     if (result.ok) {
 *         // result.value: ["index.ts", "utils/helper.ts", "utils/config.ts", ...]
 *     }
 *
 * @param directoryPath - Path to the directory to read.
 * @returns `Result` with an array of relative paths to all files and directories within, or a `FileSystemError`.
 */
export const readDirectorySync = (directoryPath: string): Result<string[], FileSystemError> => {
    try {
        return ok(fs.readdirSync(directoryPath, { recursive: true }) as string[])
    } catch (error: unknown) {
        return err(toFileSystemError(error, directoryPath))
    }
}

/**
 * Reads directory contents recursively, returning all files and subdirectories as Dirent entries (with type info such
 * as isFile()/isDirectory(), unlike the plain path strings from readDirectorySync).
 *
 * @example
 *     const result = readDirectoryEntriesSync("src")
 *     if (result.ok) {
 *         const files = result.value.filter((entry) => entry.isFile())
 *     }
 *
 * @param directoryPath - Path to the directory to read.
 * @returns `Result` with an array of Dirent entries for all files and directories within, or a `FileSystemError`.
 */
export const readDirectoryEntriesSync = (directoryPath: string): Result<fs.Dirent[], FileSystemError> => {
    try {
        return ok(fs.readdirSync(directoryPath, { recursive: true, withFileTypes: true }))
    } catch (error: unknown) {
        return err(toFileSystemError(error, directoryPath))
    }
}

/**
 * Reads directory contents recursively, returning all files and subdirectories. Async version of readDirectorySync.
 *
 * @example
 *     const result = await readDirectoryAsync("src")
 *
 * @param directoryPath - Path to the directory to read.
 * @returns Promise resolving to a `Result` with an array of relative paths, or a `FileSystemError`.
 */
export const readDirectoryAsync = async (directoryPath: string): Promise<Result<string[], FileSystemError>> => {
    try {
        return ok(await fsPromises.readdir(directoryPath, { recursive: true }))
    } catch (error: unknown) {
        return err(toFileSystemError(error, directoryPath))
    }
}

/**
 * Reads directory contents recursively, returning all files and subdirectories as Dirent entries. Async version of
 * readDirectoryEntriesSync.
 *
 * @example
 *     const result = await readDirectoryEntriesAsync("src")
 *     if (result.ok) {
 *         const files = result.value.filter((entry) => entry.isFile())
 *     }
 *
 * @param directoryPath - Path to the directory to read.
 * @returns Promise resolving to a `Result` with an array of Dirent entries, or a `FileSystemError`.
 */
export const readDirectoryEntriesAsync = async (
    directoryPath: string,
): Promise<Result<fs.Dirent[], FileSystemError>> => {
    try {
        return ok(await fsPromises.readdir(directoryPath, { recursive: true, withFileTypes: true }))
    } catch (error: unknown) {
        return err(toFileSystemError(error, directoryPath))
    }
}

/**
 * Reads immediate directory contents only (non-recursive). Does not traverse subdirectories.
 *
 * @example
 *     const result = readDirectoryNotRecursive("src")
 *     if (result.ok) {
 *         // result.value: ["index.ts", "utils", "components"] (no nested paths)
 *     }
 *
 * @param directoryPath - Path to the directory to read.
 * @returns `Result` with an array of file and directory names in the immediate directory, or a `FileSystemError`.
 */
export const readDirectoryNotRecursive = (directoryPath: string): Result<string[], FileSystemError> => {
    try {
        return ok(fs.readdirSync(directoryPath, { recursive: false }) as string[])
    } catch (error: unknown) {
        return err(toFileSystemError(error, directoryPath))
    }
}

/**
 * Reads immediate directory contents only (non-recursive). Async version of readDirectoryNotRecursive.
 *
 * @example
 *     const result = await readDirectoryNotRecursiveAsync("src")
 *
 * @param directoryPath - Path to the directory to read.
 * @returns Promise resolving to a `Result` with an array of file and directory names, or a `FileSystemError`.
 */
export const readDirectoryNotRecursiveAsync = async (
    directoryPath: string,
): Promise<Result<string[], FileSystemError>> => {
    try {
        return ok(await fsPromises.readdir(directoryPath, { recursive: false }))
    } catch (error: unknown) {
        return err(toFileSystemError(error, directoryPath))
    }
}

// ============================================================================
// Directory Removal
// ============================================================================

/**
 * Removes a directory and all its contents recursively. Not finding the directory counts as success (nothing to
 * remove), not a `FileSystemError`.
 *
 * @example
 *     const result = removeDirectorySync("temp/build")
 *     if (!result.ok) {
 *         console.error(result.error)
 *     }
 *
 * @param directoryPath - Path to the directory to remove.
 * @returns `Result`, empty on success, or a `FileSystemError` for anything other than "not found".
 */
export const removeDirectorySync = (directoryPath: string): Result<void, FileSystemError> => {
    try {
        fs.rmSync(directoryPath, { force: true, recursive: true })
        return ok(undefined)
    } catch (error: unknown) {
        return err(toFileSystemError(error, directoryPath))
    }
}

/**
 * Removes a directory and all its contents recursively. Async version of removeDirectorySync. Not finding the directory
 * counts as success.
 *
 * @example
 *     const result = await removeDirectoryAsync("temp/build")
 *     if (!result.ok) {
 *         console.error(result.error)
 *     }
 *
 * @param directoryPath - Path to the directory to remove.
 * @returns `Result`, empty on success, or a `FileSystemError` for anything other than "not found".
 */
export const removeDirectoryAsync = async (directoryPath: string): Promise<Result<void, FileSystemError>> => {
    try {
        await fsPromises.rm(directoryPath, { force: true, recursive: true })
        return ok(undefined)
    } catch (error: unknown) {
        return err(toFileSystemError(error, directoryPath))
    }
}

// ============================================================================
// Directory Existence
// ============================================================================

/**
 * Checks if a path exists and is a directory (not a file).
 *
 * @example
 *     if (doesDirectoryExist("data/logs")) {
 *         console.log("Logs directory exists")
 *     }
 *
 * @param directoryPath - Path to check.
 * @returns True if path exists and is a directory, false otherwise.
 */
export const doesDirectoryExist = (directoryPath: string): boolean => {
    const result = getStatSync(directoryPath)
    return isOk(result) && result.value.isDirectory()
}

/**
 * Checks if a path exists and is a directory (not a file). Async version of doesDirectoryExist.
 *
 * @example
 *     if (await doesDirectoryExistAsync("data/logs")) {
 *         console.log("Logs directory exists")
 *     }
 *
 * @param directoryPath - Path to check.
 * @returns Promise resolving to true if path exists and is a directory, false otherwise.
 */
export const doesDirectoryExistAsync = async (directoryPath: string): Promise<boolean> => {
    const result = await getStatAsync(directoryPath)
    return isOk(result) && result.value.isDirectory()
}
