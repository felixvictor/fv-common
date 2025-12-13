import fs from "node:fs";
import fsPromises from "node:fs/promises";
import { putError } from "./error.js";
export const makeDirectorySync = (directory) => {
    try {
        fs.mkdirSync(directory, { recursive: true });
    }
    catch (error) {
        putError(`Cannot make directory ${directory}\nError: ${String(error)}`);
    }
};
export const makeDirectoryAsync = async (directory) => {
    try {
        await fsPromises.mkdir(directory, { recursive: true });
    }
    catch (error) {
        putError(`Cannot make directory ${directory}\nError: ${String(error)}`);
    }
};
export const readDirectorySync = (directoryPath) => {
    return fs.readdirSync(directoryPath, { recursive: true });
};
export const removeDirectorySync = (directoryPath) => {
    fs.rmSync(directoryPath, { force: true, recursive: true });
};
//# sourceMappingURL=directory.js.map