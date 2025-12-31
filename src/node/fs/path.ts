import path from "node:path"

// ============================================================================
// File Extension Operations
// ============================================================================

/**
 * Changes the file extension of a path.
 * Automatically adds leading dot if not provided.
 *
 * @param filePath - The file path to modify.
 * @param extension - New extension (with or without leading dot).
 * @returns Path with the new extension.
 *
 * @example
 * changeExtension('/path/to/file.txt', 'md')
 * // Returns: '/path/to/file.md'
 *
 * @example
 * changeExtension('/path/to/file.txt', '.json')
 * // Returns: '/path/to/file.json'
 */
export const changeExtension = (filePath: string, extension: string): string => {
    const parsed = path.parse(filePath)
    return path.format({
        dir: parsed.dir,
        ext: extension.startsWith(".") ? extension : `.${extension}`,
        name: parsed.name,
    })
}

/**
 * Removes the file extension from a path.
 *
 * @param filePath - The file path to modify.
 * @returns Path without extension.
 *
 * @example
 * removeExtension('/path/to/file.txt')
 * // Returns: '/path/to/file'
 */
export const removeExtension = (filePath: string): string => {
    const parsed = path.parse(filePath)
    return path.join(parsed.dir, parsed.name)
}

/**
 * Gets the file extension from a path (including the leading dot).
 *
 * @param filePath - The file path.
 * @returns Extension with leading dot, or empty string if no extension.
 *
 * @example
 * getExtension('/path/to/file.txt')
 * // Returns: '.txt'
 *
 * @example
 * getExtension('/path/to/file')
 * // Returns: ''
 */
export const getExtension = (filePath: string): string => {
    return path.extname(filePath)
}

// ============================================================================
// File Name Operations
// ============================================================================

/**
 * Appends text to the filename (before extension).
 * Useful for creating variants like 'file-copy.txt' or 'image-thumb.jpg'.
 *
 * @param filePath - The file path to modify.
 * @param suffix - Text to append to the filename.
 * @returns Path with suffix added to filename.
 *
 * @example
 * appendToFileName('/path/to/file.txt', '-copy')
 * // Returns: '/path/to/file-copy.txt'
 *
 * @example
 * appendToFileName('/path/to/image.jpg', '-thumb')
 * // Returns: '/path/to/image-thumb.jpg'
 */
export const appendToFileName = (filePath: string, suffix: string): string => {
    const parsed = path.parse(filePath)
    return path.format({
        dir: parsed.dir,
        ext: parsed.ext,
        name: parsed.name + suffix,
    })
}

/**
 * Prepends text to the filename (before extension).
 *
 * @param filePath - The file path to modify.
 * @param prefix - Text to prepend to the filename.
 * @returns Path with prefix added to filename.
 *
 * @example
 * prependToFileName('/path/to/file.txt', 'draft-')
 * // Returns: '/path/to/draft-file.txt'
 */
export const prependToFileName = (filePath: string, prefix: string): string => {
    const parsed = path.parse(filePath)
    return path.format({
        dir: parsed.dir,
        ext: parsed.ext,
        name: prefix + parsed.name,
    })
}

/**
 * Replaces the filename while keeping directory and extension.
 *
 * @param filePath - The file path to modify.
 * @param newName - New filename (without extension).
 * @returns Path with new filename.
 *
 * @example
 * changeFileName('/path/to/file.txt', 'newname')
 * // Returns: '/path/to/newname.txt'
 *
 * @example
 * changeFileName('/path/to/old.json', 'config')
 * // Returns: '/path/to/config.json'
 */
export const changeFileName = (filePath: string, newName: string): string => {
    const parsed = path.parse(filePath)
    return path.format({
        dir: parsed.dir,
        ext: parsed.ext,
        name: newName,
    })
}

/**
 * Gets the filename without extension.
 *
 * @param filePath - The file path.
 * @returns Filename without extension.
 *
 * @example
 * getFileName('/path/to/file.txt')
 * // Returns: 'file'
 */
export const getFileName = (filePath: string): string => {
    return path.parse(filePath).name
}

/**
 * Gets the filename with extension (base name).
 *
 * @param filePath - The file path.
 * @returns Filename with extension.
 *
 * @example
 * getFileNameWithExtension('/path/to/file.txt')
 * // Returns: 'file.txt'
 */
export const getFileNameWithExtension = (filePath: string): string => {
    return path.basename(filePath)
}

// ============================================================================
// Path Operations
// ============================================================================

/**
 * Reconstructs a full path from a parsed path object.
 * This is a convenience wrapper around path.join for parsed paths.
 *
 * @param parsedPath - Parsed path object from path.parse().
 * @returns Full file path.
 *
 * @example
 * const parsed = path.parse('/path/to/file.txt')
 * getFullPath(parsed)
 * // Returns: '/path/to/file.txt'
 */
export const getFullPath = (parsedPath: path.ParsedPath): string => {
    return path.join(parsedPath.dir, parsedPath.base)
}

/**
 * Gets the directory path from a file path.
 *
 * @param filePath - The file path.
 * @returns Directory path.
 *
 * @example
 * getDirectory('/path/to/file.txt')
 * // Returns: '/path/to'
 */
export const getDirectory = (filePath: string): string => {
    return path.dirname(filePath)
}

export const joinPaths = (path1: string, path2: string): string => path.join(path1, path2)
