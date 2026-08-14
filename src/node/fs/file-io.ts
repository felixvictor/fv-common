import type { Result } from "@/result.js"

import { err, isErr, ok } from "@/result.js"
import { readFileSync, writeFile, writeFileSync } from "atomically"
import fsPromises from "node:fs/promises"

import type { FileSystemError, JsonParseError } from "../error.js"

import { toFileSystemError } from "../error.js"
import { defaultEncoding } from "./constants.js"
import { makeDirectoryAsync, makeDirectorySync } from "./directory.js"
import { getDirectory } from "./path.js"

// ============================================================================
// Text File Operations
// ============================================================================

/**
 * Reads text file synchronously using atomic read operation.
 *
 * @example
 *     const result = readTextFileSync("config.txt")
 *     if (result.ok) {
 *         console.log(result.value)
 *     }
 *
 * @param fileName - Path to the file to read.
 * @returns `Result` with the file contents, or a `FileSystemError`.
 */
export const readTextFileSync = (fileName: string): Result<string, FileSystemError> => {
    try {
        return ok(readFileSync(fileName, { encoding: defaultEncoding }))
    } catch (error: unknown) {
        return err(toFileSystemError(error, fileName))
    }
}

/**
 * Reads text file asynchronously.
 *
 * @example
 *     const result = await readTextFileAsync("config.txt")
 *     if (result.ok) {
 *         console.log(result.value)
 *     }
 *
 * @param fileName - Path to the file to read.
 * @returns Promise resolving to a `Result` with the file contents, or a `FileSystemError`.
 */
export const readTextFileAsync = async (fileName: string): Promise<Result<string, FileSystemError>> => {
    try {
        return ok(await fsPromises.readFile(fileName, { encoding: defaultEncoding }))
    } catch (error: unknown) {
        return err(toFileSystemError(error, fileName))
    }
}

/**
 * Saves text to file synchronously using atomic write, creating parent directories if needed.
 *
 * @example
 *     const result = saveTextFileSync("config.txt", "hello")
 *     if (!result.ok) {
 *         console.error(result.error)
 *     }
 *
 * @param fileName - Path to the file to save.
 * @param data - Text content to write.
 * @returns `Result`, empty on success, or a `FileSystemError` — from either creating the parent directory or the write
 *   itself.
 */
export const saveTextFileSync = (fileName: string, data: string): Result<void, FileSystemError> => {
    const directoryResult = makeDirectorySync(getDirectory(fileName))
    if (isErr(directoryResult)) return directoryResult

    try {
        writeFileSync(fileName, data, { encoding: defaultEncoding })
        return ok(undefined)
    } catch (error: unknown) {
        return err(toFileSystemError(error, fileName))
    }
}

/**
 * Saves text to file asynchronously using atomic write, creating parent directories if needed.
 *
 * @example
 *     const result = await saveTextFileAsync("config.txt", "hello")
 *     if (!result.ok) {
 *         console.error(result.error)
 *     }
 *
 * @param fileName - Path to the file to save.
 * @param data - Text content to write.
 * @returns `Result`, empty on success, or a `FileSystemError`.
 */
export const saveTextFileAsync = async (fileName: string, data: string): Promise<Result<void, FileSystemError>> => {
    const directoryResult = await makeDirectoryAsync(getDirectory(fileName))
    if (isErr(directoryResult)) return directoryResult

    try {
        await writeFile(fileName, data, { encoding: defaultEncoding })
        return ok(undefined)
    } catch (error: unknown) {
        return err(toFileSystemError(error, fileName))
    }
}

// ============================================================================
// JSON File Operations
// ============================================================================

/**
 * Reads and parses JSON file synchronously.
 *
 * @example
 *     const result = readJsonSync("config.json")
 *     if (result.ok) {
 *         console.log(result.value)
 *     }
 *
 * @param fileName - Path to the JSON file to read.
 * @returns `Result` with the parsed JSON data, or a `FileSystemError`/`JsonParseError`.
 */
export const readJsonSync = (fileName: string): Result<unknown, FileSystemError | JsonParseError> => {
    const fileResult = readTextFileSync(fileName)
    if (isErr(fileResult)) return fileResult

    try {
        return ok(JSON.parse(fileResult.value))
    } catch (error: unknown) {
        return err({ cause: error, kind: "parse-error", path: fileName })
    }
}

/**
 * Reads and parses JSON file asynchronously.
 *
 * @example
 *     const result = await readJsonAsync("config.json")
 *     if (result.ok) {
 *         console.log(result.value)
 *     }
 *
 * @param fileName - Path to the JSON file to read.
 * @returns Promise resolving to a `Result` with the parsed JSON data, or a `FileSystemError`/`JsonParseError`.
 */
export const readJsonAsync = async (fileName: string): Promise<Result<unknown, FileSystemError | JsonParseError>> => {
    const fileResult = await readTextFileAsync(fileName)
    if (isErr(fileResult)) return fileResult

    try {
        return ok(JSON.parse(fileResult.value))
    } catch (error: unknown) {
        return err({ cause: error, kind: "parse-error", path: fileName })
    }
}

/**
 * Saves an object as JSON file synchronously. Uses `JSON.stringify` with default formatting (no pretty-print).
 *
 * @example
 *     saveJsonSync("config.json", { key: "value" })
 *
 * @param fileName - Path to the file to save.
 * @param data - Object to serialize as JSON.
 * @returns `Result`, empty on success, or a `FileSystemError`.
 */
export const saveJsonSync = (fileName: string, data: object): Result<void, FileSystemError> => {
    return saveTextFileSync(fileName, JSON.stringify(data))
}

/**
 * Saves an object as JSON file asynchronously. Uses `JSON.stringify` with default formatting (no pretty-print).
 *
 * @example
 *     await saveJsonAsync("config.json", { key: "value" })
 *
 * @param fileName - Path to the file to save.
 * @param data - Object to serialize as JSON.
 * @returns `Result`, empty on success, or a `FileSystemError`.
 */
export const saveJsonAsync = async (fileName: string, data: object): Promise<Result<void, FileSystemError>> => {
    return saveTextFileAsync(fileName, JSON.stringify(data))
}

// ============================================================================
// Binary File Operations
// ============================================================================

/**
 * Reads binary file synchronously.
 *
 * @example
 *     const result = readBinaryFileSync("image.png")
 *     if (result.ok) {
 *         console.log(`File size: ${result.value.length} bytes`)
 *     }
 *
 * @param fileName - Path to the file to read.
 * @returns `Result` with the file contents as a `Buffer`, or a `FileSystemError`.
 */
export const readBinaryFileSync = (fileName: string): Result<Buffer, FileSystemError> => {
    try {
        return ok(readFileSync(fileName))
    } catch (error: unknown) {
        return err(toFileSystemError(error, fileName))
    }
}

/**
 * Reads binary file asynchronously.
 *
 * @example
 *     const result = await readBinaryFileAsync("image.png")
 *     if (result.ok) {
 *         console.log(`File size: ${result.value.length} bytes`)
 *     }
 *
 * @param fileName - Path to the file to read.
 * @returns Promise resolving to a `Result` with the file contents as a `Buffer`, or a `FileSystemError`.
 */
export const readBinaryFileAsync = async (fileName: string): Promise<Result<Buffer, FileSystemError>> => {
    try {
        return ok(await fsPromises.readFile(fileName))
    } catch (error: unknown) {
        return err(toFileSystemError(error, fileName))
    }
}

/**
 * Saves binary data to file synchronously using atomic write, creating parent directories if needed. Accepts `Buffer`
 * for binary data or `string` for text-based binary formats.
 *
 * @example
 *     saveBinaryFileSync("output.bin", buffer)
 *
 * @param fileName - Path to the file to save.
 * @param data - Binary data as `Buffer` or `string`.
 * @returns `Result`, empty on success, or a `FileSystemError`.
 */
export const saveBinaryFileSync = (fileName: string, data: Buffer | string): Result<void, FileSystemError> => {
    const directoryResult = makeDirectorySync(getDirectory(fileName))
    if (isErr(directoryResult)) return directoryResult

    try {
        writeFileSync(fileName, data)
        return ok(undefined)
    } catch (error: unknown) {
        return err(toFileSystemError(error, fileName))
    }
}

/**
 * Saves binary data to file asynchronously using atomic write, creating parent directories if needed. Accepts `Buffer`
 * for binary data or `string` for text-based binary formats.
 *
 * @example
 *     await saveBinaryFileAsync("output.bin", buffer)
 *
 * @param fileName - Path to the file to save.
 * @param data - Binary data as `Buffer` or `string`.
 * @returns `Result`, empty on success, or a `FileSystemError`.
 */
export const saveBinaryFileAsync = async (
    fileName: string,
    data: Buffer | string,
): Promise<Result<void, FileSystemError>> => {
    const directoryResult = await makeDirectoryAsync(getDirectory(fileName))
    if (isErr(directoryResult)) return directoryResult

    try {
        await writeFile(fileName, data)
        return ok(undefined)
    } catch (error: unknown) {
        return err(toFileSystemError(error, fileName))
    }
}

// ============================================================================
// Image File Operations
// ============================================================================

/**
 * Reads image file synchronously. Type-safe wrapper around `readBinaryFileSync`.
 *
 * @example
 *     const result = readImageSync("photo.jpg")
 *     if (result.ok) {
 *         console.log(`Image size: ${result.value.length} bytes`)
 *     }
 *
 * @param fileName - Path to the image file to read.
 * @returns `Result` with the image data as a `Buffer`, or a `FileSystemError`.
 */
export const readImageSync = (fileName: string): Result<Buffer, FileSystemError> => {
    return readBinaryFileSync(fileName)
}

/**
 * Reads image file asynchronously. Type-safe wrapper around `readBinaryFileAsync`.
 *
 * @example
 *     const result = await readImageAsync("photo.jpg")
 *     if (result.ok) {
 *         console.log(`Image size: ${result.value.length} bytes`)
 *     }
 *
 * @param fileName - Path to the image file to read.
 * @returns Promise resolving to a `Result` with the image data as a `Buffer`, or a `FileSystemError`.
 */
export const readImageAsync = async (fileName: string): Promise<Result<Buffer, FileSystemError>> => {
    return readBinaryFileAsync(fileName)
}

/**
 * Saves image data to file synchronously. Type-safe wrapper around `saveBinaryFileSync` that only accepts `Buffer`.
 *
 * @example
 *     saveImageSync("output.png", imageBuffer)
 *
 * @param fileName - Path to the file to save.
 * @param data - Image data as `Buffer`.
 * @returns `Result`, empty on success, or a `FileSystemError`.
 */
export const saveImageSync = (fileName: string, data: Buffer): Result<void, FileSystemError> => {
    return saveBinaryFileSync(fileName, data)
}

/**
 * Saves image data to file asynchronously. Type-safe wrapper around `saveBinaryFileAsync` that only accepts `Buffer`.
 *
 * @example
 *     await saveImageAsync("output.png", imageBuffer)
 *
 * @param fileName - Path to the file to save.
 * @param data - Image data as `Buffer`.
 * @returns `Result`, empty on success, or a `FileSystemError`.
 */
export const saveImageAsync = async (fileName: string, data: Buffer): Promise<Result<void, FileSystemError>> => {
    return saveBinaryFileAsync(fileName, data)
}
