import { readFileSync, writeFile, writeFileSync } from "atomically";
import fs from "node:fs";
import fsPromises from "node:fs/promises";
import path from "node:path";
export const putError = (error) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Request failed -->", message);
};
export const isNodeError = (error) => error instanceof Error && "code" in error;
/**
 * Make directories (recursive)
 */
export const makeDirectoryAsync = async (directory) => {
    try {
        await fsPromises.mkdir(directory, { recursive: true });
    }
    catch (error) {
        putError(error);
    }
};
export const removeFileSync = (fileName) => {
    fs.rmSync(fileName, { force: true });
};
export const removeFileAsync = async (fileName) => {
    try {
        await fsPromises.rm(fileName, { force: true });
    }
    catch (error) {
        putError(error);
    }
};
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
    const stat = fs.statSync(fileName, { throwIfNoEntry: false });
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
export const saveTextFileAsync = async (fileName, data) => {
    try {
        await writeFile(fileName, data, { encoding: "utf8" });
    }
    catch (error) {
        putError(`Cannot save ${fileName} (fsPromises.writeFile)\nError: ${error}`);
    }
};
export const saveTextFileSync = (fileName, data) => {
    try {
        writeFileSync(fileName, data, { encoding: "utf8" });
    }
    catch (error) {
        putError(`Cannot save ${fileName} (fs.writeFileSync)\nError: ${error}`);
    }
};
export const saveJsonAsync = async (fileName, data) => {
    await saveTextFileAsync(fileName, JSON.stringify(data));
};
export const saveJson = (fileName, data) => {
    saveTextFileSync(fileName, JSON.stringify(data));
};
export const readTextFileSync = (fileName) => {
    try {
        return readFileSync(fileName, { encoding: "utf8" });
    }
    catch (error) {
        if (isNodeError(error) && error.code === "ENOENT") {
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
export const readTextFileAsync = async (fileName) => {
    try {
        return await fsPromises.readFile(fileName, { encoding: "utf8" });
    }
    catch (error) {
        if (isNodeError(error) && error.code === "ENOENT") {
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
        return json == undefined ? undefined : JSON.parse(json);
    }
    catch (error) {
        putError(error);
        return undefined;
    }
};
export const pathFormat = (t) => path.resolve(String(process.env.PWD), "src", path.format(t));
export const changeExtension = (pathInput, extension) => {
    const pathParsed = path.parse(pathInput);
    const pathOutput = {
        dir: pathParsed.dir,
        ext: extension,
        name: pathParsed.name,
    };
    return pathFormat(pathOutput);
};
export const joinPaths = (path1, path2) => path.join(path1, path2);
//# sourceMappingURL=file.js.map