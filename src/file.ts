import { readFileSync, writeFile, writeFileSync } from "atomically"
import fs from "node:fs"
import fsPromises from "node:fs/promises"
import path from "node:path"

// --- Constants ---

const encoding = "utf8" as const

const fileSystemOptions = {
    force: true,
    throwIfNoEntry: false,
} as const

const errorCodes = {
    fileNotFound: "ENOENT",
} as const

// --- Error Handling ---

/**
 * Logs error messages to console in a consistent format.
 * Extracts message from Error objects or converts other types to string.
 */
export const putError = (error: unknown): void => {
    const message = error instanceof Error ? error.message : String(error)
    console.error("Request failed -->", message)
}

/**
 * Type guard to check if an unknown error is a Node.js system error.
 * Useful for checking specific error codes like ENOENT, EACCES, etc.
 */
export const isNodeError = (error: unknown): error is NodeJS.ErrnoException => error instanceof Error && "code" in error

// --- Directory Management ---

/**
 * Creates a directory and all parent directories if they don't exist.
 * Does nothing if directory already exists.
 * Logs error but doesn't throw on failure.
 */
export const makeDirectorySync = (directory: string): void => {
    try {
        fs.mkdirSync(directory, { recursive: true })
    } catch (error: unknown) {
        putError(`Cannot make directory ${directory} (makeDirectorySync)\nError: ${String(error)}`)
    }
}

/**
 * Async version of makeDirectorySync.
 * Creates directory structure recursively without throwing on existing directories.
 */
export const makeDirectoryAsync = async (directory: string): Promise<void> => {
    try {
        await fsPromises.mkdir(directory, { recursive: true })
    } catch (error: unknown) {
        putError(`Cannot make directory ${directory} (makeDirectoryAsync)\nError: ${String(error)}`)
    }
}

/**
 * Reads directory contents recursively.
 * Returns array of all file paths (including subdirectories).
 * @returns Array of relative file paths from the directory
 */
export const readDirectorySync = (directoryPath: string): string[] => {
    return fs.readdirSync(directoryPath, { recursive: true }) as string[]
}

/**
 * Removes a directory and all its contents recursively.
 * Does nothing if directory doesn't exist (force: true).
 */
export const removeDirectorySync = (directoryPath: string): void => {
    fs.rmSync(directoryPath, { force: true, recursive: true })
}

// --- File Removal ---

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

// --- File Saving ---

/**
 * Saves text to file asynchronously using atomic write.
 * Atomic write ensures file is not corrupted if process crashes during write.
 * Logs error but doesn't throw on failure.
 */
export const saveTextFileAsync = async (fileName: string, data: string): Promise<void> => {
    try {
        await writeFile(fileName, data, { encoding })
    } catch (error: unknown) {
        putError(`Cannot save ${fileName} (atomically.writeFile)\nError: ${String(error)}`)
    }
}

/**
 * Synchronous version of saveTextFileAsync.
 * Uses atomic write to prevent file corruption.
 */
export const saveTextFileSync = (fileName: string, data: string): void => {
    try {
        writeFileSync(fileName, data, { encoding })
    } catch (error: unknown) {
        putError(`Cannot save ${fileName} (atomically.writeFileSync)\nError: ${String(error)}`)
    }
}

/**
 * Saves an object as JSON file asynchronously.
 * Uses JSON.stringify with default formatting (no pretty-print).
 */
export const saveJsonAsync = async (fileName: string, data: object): Promise<void> => {
    await saveTextFileAsync(fileName, JSON.stringify(data))
}

/**
 * Synchronous version of saveJsonAsync.
 * Converts object to JSON string and saves atomically.
 */
export const saveJson = (fileName: string, data: object): void => {
    saveTextFileSync(fileName, JSON.stringify(data))
}

/**
 * Saves binary data to file synchronously using atomic write.
 * Accepts Buffer for binary data or string for text-based binary formats.
 */
export const saveBinaryFile = (fileName: string, data: Buffer | string): void => {
    try {
        writeFileSync(fileName, data)
    } catch (error: unknown) {
        putError(`Cannot save ${fileName} (saveBinaryFile)\nError: ${String(error)}`)
    }
}

/**
 * Saves image data to file.
 * Type-safe wrapper around saveBinaryFile that only accepts Buffer.
 */
export const saveImage = (fileName: string, data: Buffer): void => {
    saveBinaryFile(fileName, data)
}

// --- File Reading ---

/**
 * Reads text file synchronously using atomic read operation.
 * Returns undefined if file doesn't exist or read fails.
 * Logs specific error message for missing files.
 */
export const readTextFileSync = (fileName: string): string | undefined => {
    try {
        return readFileSync(fileName, { encoding })
    } catch (error: unknown) {
        if (isNodeError(error) && error.code === errorCodes.fileNotFound) {
            putError(`File ${fileName} not found`)
        } else {
            putError(error)
        }
        return undefined
    }
}

/**
 * Reads and parses JSON file synchronously.
 * Returns undefined if file doesn't exist or JSON is invalid.
 * Logs errors but doesn't throw.
 */
export const readJsonSync = (fileName: string): unknown => {
    try {
        const json = readTextFileSync(fileName)
        return json === undefined ? undefined : JSON.parse(json)
    } catch (error: unknown) {
        putError(error)
        return undefined
    }
}

/**
 * Async version of readTextFileSync.
 * Reads text file and returns undefined on failure.
 */
export const readTextFileAsync = async (fileName: string): Promise<string | undefined> => {
    try {
        return await fsPromises.readFile(fileName, { encoding })
    } catch (error: unknown) {
        if (isNodeError(error) && error.code === errorCodes.fileNotFound) {
            putError(`File ${fileName} not found`)
        } else {
            putError(error)
        }
        return undefined
    }
}

/**
 * Reads and parses JSON file asynchronously with type safety.
 * @template T - Expected type of the parsed JSON object
 * @returns Parsed object of type T, or undefined on failure
 */
export const readJsonAsync = async <T = unknown>(fileName: string): Promise<T | undefined> => {
    try {
        const json = await readTextFileAsync(fileName)
        return json === undefined ? undefined : (JSON.parse(json) as T)
    } catch (error: unknown) {
        putError(error)
        return undefined
    }
}

// --- Path Utilities ---

/**
 * Changes the file extension of a path.
 * Automatically adds leading dot if not provided.
 * @example changeExtension('/path/to/file.txt', 'md') → '/path/to/file.md'
 * @example changeExtension('/path/to/file.txt', '.json') → '/path/to/file.json'
 */
export const changeExtension = (filePath: string, extension: string): string => {
    const parsed = path.parse(filePath)
    return path.format({
        dir: parsed.dir,
        ext: extension.startsWith(".") ? extension : `.${extension}`,
        name: parsed.name,
    })
}

/**
 * Appends text to the filename (before extension).
 * Useful for creating variants like 'file-copy.txt' or 'image-thumb.jpg'.
 * @example appendToFileName('/path/to/file.txt', '-copy') → '/path/to/file-copy.txt'
 */
export const appendToFileName = (filePath: string, suffix: string): string => {
    const parsed = path.parse(filePath)
    return path.format({
        dir: parsed.dir,
        ext: parsed.ext,
        name: parsed.name + suffix,
    })
}

/**
 * Replaces the filename while keeping directory and extension.
 * @example changeFileName('/path/to/file.txt', 'newname') → '/path/to/newname.txt'
 */
export const changeFileName = (filePath: string, newName: string): string => {
    const parsed = path.parse(filePath)
    return path.format({
        dir: parsed.dir,
        ext: parsed.ext,
        name: newName,
    })
}
