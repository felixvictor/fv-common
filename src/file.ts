import { readFileSync, writeFile, writeFileSync } from "atomically"
import fs from "node:fs"
import fsPromises from "node:fs/promises"
import path from "node:path"

export const putError = (error: unknown): void => {
    const message = error instanceof Error ? error.message : String(error)
    console.error("Request failed -->", message)
}
export const isNodeError = (error: unknown): error is NodeJS.ErrnoException => error instanceof Error && "code" in error

/**
 * Make directories (recursive)
 */
export const makeDirectoryAsync = async (directory: string) => {
    try {
        await fsPromises.mkdir(directory, { recursive: true })
    } catch (error: unknown) {
        putError(error as string)
    }
}

export const removeFileSync = (fileName: string) => {
    fs.rmSync(fileName, { force: true })
}

export const removeFileAsync = async (fileName: string) => {
    try {
        await fsPromises.rm(fileName, { force: true })
    } catch (error: unknown) {
        putError(error as string)
    }
}

export const fileExists = (fileName: string): boolean => {
    try {
        const stat = fs.statSync(fileName)
        return stat.isFile()
    } catch {
        return false
    }
}

export const fileExistsAsync = async (fileName: string): Promise<boolean> => {
    try {
        const stats = await fsPromises.stat(fileName)
        return stats.isFile()
    } catch {
        return false
    }
}

export const saveTextFileAsync = async (fileName: string, data: string): Promise<void> => {
    try {
        await writeFile(fileName, data, { encoding: "utf8" })
    } catch (error: unknown) {
        putError(`Cannot save ${fileName} (fsPromises.writeFile)\nError: ${error as string}`)
    }
}

export const saveTextFileSync = (fileName: string, data: string): void => {
    try {
        writeFileSync(fileName, data, { encoding: "utf8" })
    } catch (error: unknown) {
        putError(`Cannot save ${fileName} (fs.writeFileSync)\nError: ${error as string}`)
    }
}

export const saveJsonAsync = async (fileName: string, data: object): Promise<void> => {
    await saveTextFileAsync(fileName, JSON.stringify(data))
}

export const saveJson = (fileName: string, data: object): void => {
    saveTextFileSync(fileName, JSON.stringify(data))
}

export const readTextFileSync = (fileName: string): string | undefined => {
    try {
        return readFileSync(fileName, { encoding: "utf8" })
    } catch (error: unknown) {
        if (isNodeError(error) && error.code === "ENOENT") {
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

export const readTextFileAsync = async (fileName: string): Promise<string | undefined> => {
    try {
        return await fsPromises.readFile(fileName, { encoding: "utf8" })
    } catch (error: unknown) {
        if (isNodeError(error) && error.code === "ENOENT") {
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
        return json == undefined ? undefined : (JSON.parse(json) as T)
    } catch (error: unknown) {
        putError(error)
        return undefined
    }
}

export const pathFormat = (t: path.FormatInputPathObject): string =>
    path.resolve(String(process.env.PWD), "src", path.format(t))

export const changeExtension = (pathInput: string, extension: string): string => {
    const pathParsed = path.parse(pathInput)
    const pathOutput: path.FormatInputPathObject = {
        dir: pathParsed.dir,
        ext: extension,
        name: pathParsed.name,
    }
    return pathFormat(pathOutput)
}

export const joinPaths = (path1: string, path2: string): string => path.join(path1, path2)
