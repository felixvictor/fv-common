import fs from "node:fs";
import fsPromises from "node:fs/promises";
import { readFileSync, writeFile, writeFileSync } from "atomically";
import path from "node:path";

//#region src/fs/error.ts
const errorCodes = { fileNotFound: "ENOENT" };
const putError = (error) => {
	const message = error instanceof Error ? error.message : String(error);
	console.error("Request failed -->", message);
};
const isNodeError = (error) => error instanceof Error && "code" in error;

//#endregion
//#region src/fs/directory.ts
const makeDirectorySync = (directory) => {
	try {
		fs.mkdirSync(directory, { recursive: true });
	} catch (error) {
		putError(`Cannot make directory ${directory}\nError: ${String(error)}`);
	}
};
const makeDirectoryAsync = async (directory) => {
	try {
		await fsPromises.mkdir(directory, { recursive: true });
	} catch (error) {
		putError(`Cannot make directory ${directory}\nError: ${String(error)}`);
	}
};
const readDirectorySync = (directoryPath) => {
	return fs.readdirSync(directoryPath, { recursive: true });
};
const removeDirectorySync = (directoryPath) => {
	fs.rmSync(directoryPath, {
		force: true,
		recursive: true
	});
};

//#endregion
//#region src/fs/file-io.ts
const encoding = "utf8";
/**
* Saves text to file asynchronously using atomic write.
* Atomic write ensures file is not corrupted if process crashes during write.
* Logs error but doesn't throw on failure.
*/
const saveTextFileAsync = async (fileName, data) => {
	try {
		await writeFile(fileName, data, { encoding });
	} catch (error) {
		putError(`Cannot save ${fileName} (atomically.writeFile)\nError: ${String(error)}`);
	}
};
/**
* Synchronous version of saveTextFileAsync.
* Uses atomic write to prevent file corruption.
*/
const saveTextFileSync = (fileName, data) => {
	try {
		writeFileSync(fileName, data, { encoding });
	} catch (error) {
		putError(`Cannot save ${fileName} (atomically.writeFileSync)\nError: ${String(error)}`);
	}
};
/**
* Saves an object as JSON file asynchronously.
* Uses JSON.stringify with default formatting (no pretty-print).
*/
const saveJsonAsync = async (fileName, data) => {
	await saveTextFileAsync(fileName, JSON.stringify(data));
};
/**
* Synchronous version of saveJsonAsync.
* Converts object to JSON string and saves atomically.
*/
const saveJson = (fileName, data) => {
	saveTextFileSync(fileName, JSON.stringify(data));
};
/**
* Saves binary data to file synchronously using atomic write.
* Accepts Buffer for binary data or string for text-based binary formats.
*/
const saveBinaryFile = (fileName, data) => {
	try {
		writeFileSync(fileName, data);
	} catch (error) {
		putError(`Cannot save ${fileName} (saveBinaryFile)\nError: ${String(error)}`);
	}
};
/**
* Saves image data to file.
* Type-safe wrapper around saveBinaryFile that only accepts Buffer.
*/
const saveImage = (fileName, data) => {
	saveBinaryFile(fileName, data);
};
/**
* Reads text file synchronously using atomic read operation.
* Returns undefined if file doesn't exist or read fails.
* Logs specific error message for missing files.
*/
const readTextFileSync = (fileName) => {
	try {
		return readFileSync(fileName, { encoding });
	} catch (error) {
		if (isNodeError(error) && error.code === errorCodes.fileNotFound) putError(`File ${fileName} not found`);
		else putError(error);
		return;
	}
};
/**
* Reads and parses JSON file synchronously.
* Returns undefined if file doesn't exist or JSON is invalid.
* Logs errors but doesn't throw.
*/
const readJsonSync = (fileName) => {
	try {
		const json = readTextFileSync(fileName);
		return json === void 0 ? void 0 : JSON.parse(json);
	} catch (error) {
		putError(error);
		return;
	}
};
/**
* Async version of readTextFileSync.
* Reads text file and returns undefined on failure.
*/
const readTextFileAsync = async (fileName) => {
	try {
		return await fsPromises.readFile(fileName, { encoding });
	} catch (error) {
		if (isNodeError(error) && error.code === errorCodes.fileNotFound) putError(`File ${fileName} not found`);
		else putError(error);
		return;
	}
};

//#endregion
//#region src/fs/file-ops.ts
const fileSystemOptions = {
	force: true,
	throwIfNoEntry: false
};
/**
* Removes a file. Does nothing if file doesn't exist (force: true).
*/
const removeFileSync = (fileName) => {
	fs.rmSync(fileName, { force: fileSystemOptions.force });
};
/**
* Async version of removeFileSync.
* Logs error but doesn't throw on failure.
*/
const removeFileAsync = async (fileName) => {
	try {
		await fsPromises.rm(fileName, { force: fileSystemOptions.force });
	} catch (error) {
		putError(error);
	}
};
/**
* Checks if a file exists and is a regular file (not a directory).
* @returns true if file exists, false otherwise
*/
const fileExists = (fileName) => {
	try {
		return fs.statSync(fileName).isFile();
	} catch {
		return false;
	}
};
/**
* Checks if a file exists and has zero bytes.
* @returns true if file exists and is empty, false if missing or has content
*/
const fileEmpty = (fileName) => {
	return fs.statSync(fileName, { throwIfNoEntry: fileSystemOptions.throwIfNoEntry })?.size === 0;
};
/**
* Async version of fileExists.
* Checks if path exists and is a regular file.
*/
const fileExistsAsync = async (fileName) => {
	try {
		return (await fsPromises.stat(fileName)).isFile();
	} catch {
		return false;
	}
};

//#endregion
//#region src/fs/path.ts
/**
* Changes the file extension of a path.
* Automatically adds leading dot if not provided.
* @example changeExtension('/path/to/file.txt', 'md') → '/path/to/file.md'
* @example changeExtension('/path/to/file.txt', '.json') → '/path/to/file.json'
*/
const changeExtension = (filePath, extension) => {
	const parsed = path.parse(filePath);
	return path.format({
		dir: parsed.dir,
		ext: extension.startsWith(".") ? extension : `.${extension}`,
		name: parsed.name
	});
};
/**
* Appends text to the filename (before extension).
* Useful for creating variants like 'file-copy.txt' or 'image-thumb.jpg'.
* @example appendToFileName('/path/to/file.txt', '-copy') → '/path/to/file-copy.txt'
*/
const appendToFileName = (filePath, suffix) => {
	const parsed = path.parse(filePath);
	return path.format({
		dir: parsed.dir,
		ext: parsed.ext,
		name: parsed.name + suffix
	});
};
/**
* Replaces the filename while keeping directory and extension.
* @example changeFileName('/path/to/file.txt', 'newname') → '/path/to/newname.txt'
*/
const changeFileName = (filePath, newName) => {
	const parsed = path.parse(filePath);
	return path.format({
		dir: parsed.dir,
		ext: parsed.ext,
		name: newName
	});
};

//#endregion
export { appendToFileName, changeExtension, changeFileName, errorCodes, fileEmpty, fileExists, fileExistsAsync, isNodeError, makeDirectoryAsync, makeDirectorySync, putError, readDirectorySync, readJsonSync, readTextFileAsync, readTextFileSync, removeDirectorySync, removeFileAsync, removeFileSync, saveBinaryFile, saveImage, saveJson, saveJsonAsync, saveTextFileAsync, saveTextFileSync };
//# sourceMappingURL=node.mjs.map