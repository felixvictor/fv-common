import { readFileSync, writeFile, writeFileSync } from "atomically"
import fsPromises from "node:fs/promises"

import { errorCodes, isNodeError, putError } from "../error.js"
import { defaultEncoding } from "./constants.js"

// ============================================================================
// Text File Operations
// ============================================================================

/**
 * Reads text file synchronously using atomic read operation.
 * Returns undefined if file doesn't exist or read fails.
 *
 * @param fileName - Path to the file to read.
 * @returns File contents as string, or undefined on error.
 *
 * @example
 * const content = readTextFileSync('config.txt')
 * if (content) {
 *   console.log(content)
 * }
 */
export const readTextFileSync = (fileName: string): string | undefined => {
    try {
        return readFileSync(fileName, { encoding: defaultEncoding })
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
 * Reads text file asynchronously.
 * Returns undefined if file doesn't exist or read fails.
 *
 * @param fileName - Path to the file to read.
 * @returns Promise resolving to file contents as string, or undefined on error.
 *
 * @example
 * const content = await readTextFileAsync('config.txt')
 * if (content) {
 *   console.log(content)
 * }
 */
export const readTextFileAsync = async (fileName: string): Promise<string | undefined> => {
    try {
        return await fsPromises.readFile(fileName, { encoding: defaultEncoding })
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
 * Saves text to file synchronously using atomic write.
 * Atomic write ensures file is not corrupted if process crashes during write.
 * Logs error but doesn't throw on failure.
 *
 * @param fileName - Path to the file to save.
 * @param data - Text content to write.
 *
 * @example
 * saveTextFileSync('output.txt', 'Hello, world!')
 */
export const saveTextFileSync = (fileName: string, data: string): void => {
    try {
        writeFileSync(fileName, data, { encoding: defaultEncoding })
    } catch (error: unknown) {
        putError(`Cannot save ${fileName} (atomically.writeFileSync)\nError: ${String(error)}`)
    }
}

/**
 * Saves text to file asynchronously using atomic write.
 * Atomic write ensures file is not corrupted if process crashes during write.
 * Logs error but doesn't throw on failure.
 *
 * @param fileName - Path to the file to save.
 * @param data - Text content to write.
 *
 * @example
 * await saveTextFileAsync('output.txt', 'Hello, world!')
 */
export const saveTextFileAsync = async (fileName: string, data: string): Promise<void> => {
    try {
        await writeFile(fileName, data, { encoding: defaultEncoding })
    } catch (error: unknown) {
        putError(`Cannot save ${fileName} (atomically.writeFile)\nError: ${String(error)}`)
    }
}

// ============================================================================
// JSON File Operations
// ============================================================================

/**
 * Reads and parses JSON file synchronously.
 * Returns undefined if file doesn't exist or JSON is invalid.
 *
 * @param fileName - Path to the JSON file to read.
 * @returns Parsed JSON data, or undefined on error.
 *
 * @example
 * const config = readJsonSync('config.json')
 * if (config) {
 *   console.log(config)
 * }
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
 * Reads and parses JSON file asynchronously.
 * Returns undefined if file doesn't exist or JSON is invalid.
 *
 * @param fileName - Path to the JSON file to read.
 * @returns Promise resolving to parsed JSON data, or undefined on error.
 *
 * @example
 * const config = await readJsonAsync('config.json')
 * if (config) {
 *   console.log(config)
 * }
 */
export const readJsonAsync = async (fileName: string): Promise<unknown> => {
    try {
        const json = await readTextFileAsync(fileName)
        return json === undefined ? undefined : JSON.parse(json)
    } catch (error: unknown) {
        putError(error)
        return undefined
    }
}

/**
 * Saves an object as JSON file synchronously.
 * Uses JSON.stringify with default formatting (no pretty-print).
 *
 * @param fileName - Path to the file to save.
 * @param data - Object to serialize as JSON.
 *
 * @example
 * saveJsonSync('config.json', { key: 'value' })
 */
export const saveJsonSync = (fileName: string, data: object): void => {
    saveTextFileSync(fileName, JSON.stringify(data))
}

/**
 * Saves an object as JSON file asynchronously.
 * Uses JSON.stringify with default formatting (no pretty-print).
 *
 * @param fileName - Path to the file to save.
 * @param data - Object to serialize as JSON.
 *
 * @example
 * await saveJsonAsync('config.json', { key: 'value' })
 */
export const saveJsonAsync = async (fileName: string, data: object): Promise<void> => {
    await saveTextFileAsync(fileName, JSON.stringify(data))
}

// ============================================================================
// Binary File Operations
// ============================================================================

/**
 * Reads binary file synchronously.
 * Returns undefined if file doesn't exist or read fails.
 *
 * @param fileName - Path to the file to read.
 * @returns File contents as Buffer, or undefined on error.
 *
 * @example
 * const buffer = readBinaryFileSync('image.png')
 * if (buffer) {
 *   console.log(`File size: ${buffer.length} bytes`)
 * }
 */
export const readBinaryFileSync = (fileName: string): Buffer | undefined => {
    try {
        return readFileSync(fileName)
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
 * Reads binary file asynchronously.
 * Returns undefined if file doesn't exist or read fails.
 *
 * @param fileName - Path to the file to read.
 * @returns Promise resolving to file contents as Buffer, or undefined on error.
 *
 * @example
 * const buffer = await readBinaryFileAsync('image.png')
 * if (buffer) {
 *   console.log(`File size: ${buffer.length} bytes`)
 * }
 */
export const readBinaryFileAsync = async (fileName: string): Promise<Buffer | undefined> => {
    try {
        return await fsPromises.readFile(fileName)
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
 * Saves binary data to file synchronously using atomic write.
 * Accepts Buffer for binary data or string for text-based binary formats.
 *
 * @param fileName - Path to the file to save.
 * @param data - Binary data as Buffer or string.
 *
 * @example
 * saveBinaryFileSync('output.bin', buffer)
 */
export const saveBinaryFileSync = (fileName: string, data: Buffer | string): void => {
    try {
        writeFileSync(fileName, data)
    } catch (error: unknown) {
        putError(`Cannot save ${fileName} (saveBinaryFileSync)\nError: ${String(error)}`)
    }
}

/**
 * Saves binary data to file asynchronously using atomic write.
 * Accepts Buffer for binary data or string for text-based binary formats.
 *
 * @param fileName - Path to the file to save.
 * @param data - Binary data as Buffer or string.
 *
 * @example
 * await saveBinaryFileAsync('output.bin', buffer)
 */
export const saveBinaryFileAsync = async (fileName: string, data: Buffer | string): Promise<void> => {
    try {
        await writeFile(fileName, data)
    } catch (error: unknown) {
        putError(`Cannot save ${fileName} (saveBinaryFileAsync)\nError: ${String(error)}`)
    }
}

// ============================================================================
// Image File Operations
// ============================================================================

/**
 * Reads image file synchronously.
 * Type-safe wrapper around readBinaryFileSync that returns Buffer.
 *
 * @param fileName - Path to the image file to read.
 * @returns Image data as Buffer, or undefined on error.
 *
 * @example
 * const image = readImageSync('photo.jpg')
 * if (image) {
 *   console.log(`Image size: ${image.length} bytes`)
 * }
 */
export const readImageSync = (fileName: string): Buffer | undefined => {
    return readBinaryFileSync(fileName)
}

/**
 * Reads image file asynchronously.
 * Type-safe wrapper around readBinaryFileAsync that returns Buffer.
 *
 * @param fileName - Path to the image file to read.
 * @returns Promise resolving to image data as Buffer, or undefined on error.
 *
 * @example
 * const image = await readImageAsync('photo.jpg')
 * if (image) {
 *   console.log(`Image size: ${image.length} bytes`)
 * }
 */
export const readImageAsync = async (fileName: string): Promise<Buffer | undefined> => {
    return readBinaryFileAsync(fileName)
}

/**
 * Saves image data to file synchronously.
 * Type-safe wrapper around saveBinaryFileSync that only accepts Buffer.
 *
 * @param fileName - Path to the file to save.
 * @param data - Image data as Buffer.
 *
 * @example
 * saveImageSync('output.png', imageBuffer)
 */
export const saveImageSync = (fileName: string, data: Buffer): void => {
    saveBinaryFileSync(fileName, data)
}

/**
 * Saves image data to file asynchronously.
 * Type-safe wrapper around saveBinaryFileAsync that only accepts Buffer.
 *
 * @param fileName - Path to the file to save.
 * @param data - Image data as Buffer.
 *
 * @example
 * await saveImageAsync('output.png', imageBuffer)
 */
export const saveImageAsync = async (fileName: string, data: Buffer): Promise<void> => {
    await saveBinaryFileAsync(fileName, data)
}
