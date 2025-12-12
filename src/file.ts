import { readFileSync, writeFile, writeFileSync } from "atomically"
import fs from "node:fs"
import fsPromises from "node:fs/promises"

// --- Constants ---

const encoding = "utf8" as const

const fileSystemOptions = {
    force: true,
    recursive: true,
    throwIfNoEntry: false,
} as const

const errorCodes = {
    fileNotFound: "ENOENT",
} as const

// --- Error Handling ---

export const putError = (error: unknown): void => {
    const message = error instanceof Error ? error.message : String(error)
    console.error("Request failed -->", message)
}

/**
 * Type guard to check if an unknown error object is a standard Node.js error.
 */
export const isNodeError = (error: unknown): error is NodeJS.ErrnoException => error instanceof Error && "code" in error

// --- Directory Management ---

/**
 * Creates directories recursively
 */
export const makeDirectoryAsync = async (directory: string): Promise<void> => {
    try {
        await fsPromises.mkdir(directory, { recursive: fileSystemOptions.recursive })
    } catch (error: unknown) {
        putError(error)
    }
}

// --- File Removal ---

export const removeFileSync = (fileName: string): void => {
    fs.rmSync(fileName, { force: fileSystemOptions.force })
}

export const removeFileAsync = async (fileName: string): Promise<void> => {
    try {
        await fsPromises.rm(fileName, { force: fileSystemOptions.force })
    } catch (error: unknown) {
        putError(error)
    }
}

// --- File Existence and Stats ---

export const fileExists = (fileName: string): boolean => {
    try {
        const stat = fs.statSync(fileName)
        return stat.isFile()
    } catch {
        return false
    }
}

export const fileEmpty = (fileName: string): boolean => {
    const stat = fs.statSync(fileName, { throwIfNoEntry: fileSystemOptions.throwIfNoEntry })
    return stat?.size === 0
}

export const fileExistsAsync = async (fileName: string): Promise<boolean> => {
    try {
        const stats = await fsPromises.stat(fileName)
        return stats.isFile()
    } catch {
        return false
    }
}

// --- File Saving (Atomic Writes) ---

/**
 * Saves a text file asynchronously using atomic write operation.
 */
export const saveTextFileAsync = async (fileName: string, data: string): Promise<void> => {
    try {
        await writeFile(fileName, data, { encoding })
    } catch (error: unknown) {
        putError(`Cannot save ${fileName} (atomically.writeFile)\nError: ${String(error)}`)
    }
}

/**
 * Saves a text file synchronously using atomic write operation.
 */
export const saveTextFileSync = (fileName: string, data: string): void => {
    try {
        writeFileSync(fileName, data, { encoding })
    } catch (error: unknown) {
        putError(`Cannot save ${fileName} (atomically.writeFileSync)\nError: ${String(error)}`)
    }
}

export const saveJsonAsync = async (fileName: string, data: object): Promise<void> => {
    await saveTextFileAsync(fileName, JSON.stringify(data))
}

export const saveJson = (fileName: string, data: object): void => {
    saveTextFileSync(fileName, JSON.stringify(data))
}

// --- File Reading ---

/**
 * Reads a text file synchronously using atomically's read method.
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
 * Reads a text file asynchronously using standard fsPromises.
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

export const readJsonAsync = async <T = unknown>(fileName: string): Promise<T | undefined> => {
    try {
        const json = await readTextFileAsync(fileName)
        return json === undefined ? undefined : (JSON.parse(json) as T)
    } catch (error: unknown) {
        putError(error)
        return undefined
    }
}
