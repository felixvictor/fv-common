import { readFileSync, writeFile, writeFileSync } from "atomically"
import fsPromises from "node:fs/promises"

import { errorCodes, isNodeError, putError } from "./error.js"

const encoding = "utf8" as const

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
