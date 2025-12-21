import fs from "node:fs"
import fsPromises from "node:fs/promises"

import { putError } from "../error.js"

export const makeDirectorySync = (directory: string): void => {
    try {
        fs.mkdirSync(directory, { recursive: true })
    } catch (error: unknown) {
        putError(`Cannot make directory ${directory}\nError: ${String(error)}`)
    }
}

export const makeDirectoryAsync = async (directory: string): Promise<void> => {
    try {
        await fsPromises.mkdir(directory, { recursive: true })
    } catch (error: unknown) {
        putError(`Cannot make directory ${directory}\nError: ${String(error)}`)
    }
}

export const readDirectorySync = (directoryPath: string): string[] => {
    return fs.readdirSync(directoryPath, { recursive: true }) as string[]
}

export const removeDirectorySync = (directoryPath: string): void => {
    fs.rmSync(directoryPath, { force: true, recursive: true })
}
