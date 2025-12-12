import { readFileSync, writeFile, writeFileSync } from "atomically";
import fs from "node:fs";
import fsPromises from "node:fs/promises";
// --- Constants ---
const encoding = "utf8";
const fileSystemOptions = {
    force: true,
    recursive: true,
    throwIfNoEntry: false,
};
const errorCodes = {
    fileNotFound: "ENOENT",
};
// --- Error Handling ---
export const putError = (error) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Request failed -->", message);
};
/**
 * Type guard to check if an unknown error object is a standard Node.js error.
 */
export const isNodeError = (error) => error instanceof Error && "code" in error;
// --- Directory Management ---
/**
 * Creates directories recursively
 */
export const makeDirectoryAsync = async (directory) => {
    try {
        await fsPromises.mkdir(directory, { recursive: fileSystemOptions.recursive });
    }
    catch (error) {
        putError(error);
    }
};
// --- File Removal ---
export const removeFileSync = (fileName) => {
    fs.rmSync(fileName, { force: fileSystemOptions.force });
};
export const removeFileAsync = async (fileName) => {
    try {
        await fsPromises.rm(fileName, { force: fileSystemOptions.force });
    }
    catch (error) {
        putError(error);
    }
};
// --- File Existence and Stats ---
export const fileExists = (fileName) => {
    try {
        const stat = fs.statSync(fileName);
        return stat.isFile();
    }
    catch {
        return false;
    }
};
export const fileEmpty = (fileName) => {
    const stat = fs.statSync(fileName, { throwIfNoEntry: fileSystemOptions.throwIfNoEntry });
    return stat?.size === 0;
};
export const fileExistsAsync = async (fileName) => {
    try {
        const stats = await fsPromises.stat(fileName);
        return stats.isFile();
    }
    catch {
        return false;
    }
};
// --- File Saving (Atomic Writes) ---
/**
 * Saves a text file asynchronously using atomic write operation.
 */
export const saveTextFileAsync = async (fileName, data) => {
    try {
        await writeFile(fileName, data, { encoding });
    }
    catch (error) {
        putError(`Cannot save ${fileName} (atomically.writeFile)\nError: ${String(error)}`);
    }
};
/**
 * Saves a text file synchronously using atomic write operation.
 */
export const saveTextFileSync = (fileName, data) => {
    try {
        writeFileSync(fileName, data, { encoding });
    }
    catch (error) {
        putError(`Cannot save ${fileName} (atomically.writeFileSync)\nError: ${String(error)}`);
    }
};
export const saveJsonAsync = async (fileName, data) => {
    await saveTextFileAsync(fileName, JSON.stringify(data));
};
export const saveJson = (fileName, data) => {
    saveTextFileSync(fileName, JSON.stringify(data));
};
// --- File Reading ---
/**
 * Reads a text file synchronously using atomically's read method.
 */
export const readTextFileSync = (fileName) => {
    try {
        return readFileSync(fileName, { encoding });
    }
    catch (error) {
        if (isNodeError(error) && error.code === errorCodes.fileNotFound) {
            putError(`File ${fileName} not found`);
        }
        else {
            putError(error);
        }
        return undefined;
    }
};
export const readJsonSync = (fileName) => {
    try {
        const json = readTextFileSync(fileName);
        return json === undefined ? undefined : JSON.parse(json);
    }
    catch (error) {
        putError(error);
        return undefined;
    }
};
/**
 * Reads a text file asynchronously using standard fsPromises.
 */
export const readTextFileAsync = async (fileName) => {
    try {
        return await fsPromises.readFile(fileName, { encoding });
    }
    catch (error) {
        if (isNodeError(error) && error.code === errorCodes.fileNotFound) {
            putError(`File ${fileName} not found`);
        }
        else {
            putError(error);
        }
        return undefined;
    }
};
export const readJsonAsync = async (fileName) => {
    try {
        const json = await readTextFileAsync(fileName);
        return json === undefined ? undefined : JSON.parse(json);
    }
    catch (error) {
        putError(error);
        return undefined;
    }
};
//# sourceMappingURL=file.js.map