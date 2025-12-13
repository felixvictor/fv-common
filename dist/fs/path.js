import path from "node:path";
/**
 * Changes the file extension of a path.
 * Automatically adds leading dot if not provided.
 * @example changeExtension('/path/to/file.txt', 'md') → '/path/to/file.md'
 * @example changeExtension('/path/to/file.txt', '.json') → '/path/to/file.json'
 */
export const changeExtension = (filePath, extension) => {
    const parsed = path.parse(filePath);
    return path.format({
        dir: parsed.dir,
        ext: extension.startsWith(".") ? extension : `.${extension}`,
        name: parsed.name,
    });
};
/**
 * Appends text to the filename (before extension).
 * Useful for creating variants like 'file-copy.txt' or 'image-thumb.jpg'.
 * @example appendToFileName('/path/to/file.txt', '-copy') → '/path/to/file-copy.txt'
 */
export const appendToFileName = (filePath, suffix) => {
    const parsed = path.parse(filePath);
    return path.format({
        dir: parsed.dir,
        ext: parsed.ext,
        name: parsed.name + suffix,
    });
};
/**
 * Replaces the filename while keeping directory and extension.
 * @example changeFileName('/path/to/file.txt', 'newname') → '/path/to/newname.txt'
 */
export const changeFileName = (filePath, newName) => {
    const parsed = path.parse(filePath);
    return path.format({
        dir: parsed.dir,
        ext: parsed.ext,
        name: newName,
    });
};
//# sourceMappingURL=path.js.map