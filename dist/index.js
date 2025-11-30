// src/file.ts
import { readFileSync, writeFile, writeFileSync } from "atomically";
import fs from "fs";
import fsPromises from "fs/promises";
import path from "path";
var putError = (error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error("Request failed -->", message);
};
var isNodeError = (error) => error instanceof Error && "code" in error;
var makeDirectoryAsync = async (directory) => {
  try {
    await fsPromises.mkdir(directory, { recursive: true });
  } catch (error) {
    putError(error);
  }
};
var removeFileSync = (fileName) => {
  fs.rmSync(fileName, { force: true });
};
var removeFileAsync = async (fileName) => {
  try {
    await fsPromises.rm(fileName, { force: true });
  } catch (error) {
    putError(error);
  }
};
var fileExists = (fileName) => {
  try {
    const stat = fs.statSync(fileName);
    return stat.isFile();
  } catch {
    return false;
  }
};
var fileEmpty = (fileName) => {
  const stat = fs.statSync(fileName, { throwIfNoEntry: false });
  return stat?.size === 0;
};
var fileExistsAsync = async (fileName) => {
  try {
    const stats = await fsPromises.stat(fileName);
    return stats.isFile();
  } catch {
    return false;
  }
};
var saveTextFileAsync = async (fileName, data) => {
  try {
    await writeFile(fileName, data, { encoding: "utf8" });
  } catch (error) {
    putError(`Cannot save ${fileName} (fsPromises.writeFile)
Error: ${error}`);
  }
};
var saveTextFileSync = (fileName, data) => {
  try {
    writeFileSync(fileName, data, { encoding: "utf8" });
  } catch (error) {
    putError(`Cannot save ${fileName} (fs.writeFileSync)
Error: ${error}`);
  }
};
var saveJsonAsync = async (fileName, data) => {
  await saveTextFileAsync(fileName, JSON.stringify(data));
};
var saveJson = (fileName, data) => {
  saveTextFileSync(fileName, JSON.stringify(data));
};
var readTextFileSync = (fileName) => {
  try {
    return readFileSync(fileName, { encoding: "utf8" });
  } catch (error) {
    if (isNodeError(error) && error.code === "ENOENT") {
      putError(`File ${fileName} not found`);
    } else {
      putError(error);
    }
    return void 0;
  }
};
var readJsonSync = (fileName) => {
  try {
    const json = readTextFileSync(fileName);
    return json === void 0 ? void 0 : JSON.parse(json);
  } catch (error) {
    putError(error);
    return void 0;
  }
};
var readTextFileAsync = async (fileName) => {
  try {
    return await fsPromises.readFile(fileName, { encoding: "utf8" });
  } catch (error) {
    if (isNodeError(error) && error.code === "ENOENT") {
      putError(`File ${fileName} not found`);
    } else {
      putError(error);
    }
    return void 0;
  }
};
var readJsonAsync = async (fileName) => {
  try {
    const json = await readTextFileAsync(fileName);
    return json == void 0 ? void 0 : JSON.parse(json);
  } catch (error) {
    putError(error);
    return void 0;
  }
};
var pathFormat = (t) => path.resolve(String(process.env.PWD), "src", path.format(t));
var changeExtension = (pathInput, extension) => {
  const pathParsed = path.parse(pathInput);
  const pathOutput = {
    dir: pathParsed.dir,
    ext: extension,
    name: pathParsed.name
  };
  return pathFormat(pathOutput);
};
var joinPaths = (path1, path2) => path.join(path1, path2);

// src/sort.ts
var parseSortArgument = (property) => {
  const propertyString = String(property);
  const desc = propertyString.startsWith("-");
  const key = desc ? propertyString.slice(1) : propertyString;
  return { desc, key };
};
var compareStrings = (a, b) => a.localeCompare(b, void 0, { numeric: true, sensitivity: "base" });
var isNullish = (value) => value == void 0;
var compareNullish = (a, b) => {
  const aIsNullish = isNullish(a);
  const bIsNullish = isNullish(b);
  if (aIsNullish && bIsNullish) return 0;
  if (aIsNullish) return 1;
  if (bIsNullish) return -1;
  return void 0;
};
var compareValues = (a, b) => {
  if (a === b) return 0;
  const nullishResult = compareNullish(a, b);
  if (nullishResult !== void 0) return nullishResult;
  const numberA = Number(a);
  const numberB = Number(b);
  if (Number.isFinite(numberA) && Number.isFinite(numberB)) {
    return numberA - numberB;
  }
  if (typeof a === "string" && typeof b === "string") {
    return compareStrings(a, b);
  }
  return 0;
};
var sortBy = (propertyNames) => (a, b) => {
  for (const property of propertyNames) {
    const { desc, key } = parseSortArgument(property);
    const result = compareValues(a[key], b[key]);
    if (result !== 0) {
      return desc ? -result : result;
    }
  }
  return 0;
};
var simpleNumberSort = (a, b) => {
  const nullishResult = compareNullish(a, b);
  if (nullishResult !== void 0) return nullishResult;
  return a - b;
};
var simpleStringSort = (a, b) => {
  const nullishResult = compareNullish(a, b);
  if (nullishResult !== void 0) return nullishResult;
  return compareStrings(a, b);
};
export {
  changeExtension,
  fileEmpty,
  fileExists,
  fileExistsAsync,
  isNodeError,
  joinPaths,
  makeDirectoryAsync,
  pathFormat,
  putError,
  readJsonAsync,
  readJsonSync,
  readTextFileAsync,
  readTextFileSync,
  removeFileAsync,
  removeFileSync,
  saveJson,
  saveJsonAsync,
  saveTextFileAsync,
  saveTextFileSync,
  simpleNumberSort,
  simpleStringSort,
  sortBy
};
