import { ExecOptions, ExecSyncOptions } from "node:child_process";

//#region src/fs/command.d.ts

/**
 * Result of async command execution.
 */
interface AsyncCommandResult {
  error?: Error;
  stderr: string;
  stdout: string;
  success: boolean;
}
/**
 * Result of command execution.
 */
interface CommandResult {
  error?: Error;
  output: Buffer | undefined;
  success: boolean;
}
/**
 * Executes a shell command synchronously with error handling.
 *
 * @param command - The shell command to execute.
 * @param options - Optional execSync options.
 * @returns Buffer containing command output, or empty Buffer on error.
 *
 * @example
 * const output = executeCommand("ls -la")
 * console.log(output.toString())
 *
 * @example
 * // With options
 * const output = executeCommand("pwd", { cwd: "/tmp" })
 */
declare const executeCommand: (command: string, options?: ExecSyncOptions) => Buffer;
/**
 * Executes a shell command synchronously and returns a detailed result.
 *
 * @param command - The shell command to execute.
 * @param options - Optional execSync options.
 * @returns Object containing success status, output, and error if any.
 *
 * @example
 * const result = executeCommandWithResult("ls -la")
 * if (result.success) {
 *   console.log(result.output?.toString())
 * } else {
 *   console.error("Command failed:", result.error)
 * }
 */
declare const executeCommandWithResult: (command: string, options?: ExecSyncOptions) => CommandResult;
/**
 * Executes a shell command synchronously and returns output as string.
 * Returns empty string on error.
 *
 * @param command - The shell command to execute.
 * @param options - Optional execSync options.
 * @returns Command output as string, or empty string on error.
 *
 * @example
 * const path = executeCommandString("pwd")
 * console.log("Current directory:", path.trim())
 */
declare const executeCommandString: (command: string, options?: ExecSyncOptions) => string;
/**
 * Checks if a command exists and is executable.
 *
 * @param command - Command name to check (e.g., "git", "node").
 * @returns True if command exists, false otherwise.
 *
 * @example
 * if (commandExists("git")) {
 *   console.log("Git is available")
 * }
 */
declare const commandExists: (command: string) => boolean;
/**
 * Executes a shell command asynchronously with error handling.
 *
 * @param command - The shell command to execute.
 * @param options - Optional exec options.
 * @returns Promise resolving to command stdout, or empty string on error.
 *
 * @example
 * const output = await executeCommandAsync("ls -la")
 * console.log(output)
 *
 * @example
 * // With options
 * const output = await executeCommandAsync("pwd", { cwd: "/tmp" })
 */
declare const executeCommandAsync: (command: string, options?: ExecOptions) => Promise<string>;
/**
 * Executes a shell command asynchronously and returns a detailed result.
 *
 * @param command - The shell command to execute.
 * @param options - Optional exec options.
 * @returns Promise resolving to object containing success status, stdout, stderr, and error if any.
 *
 * @example
 * const result = await executeCommandAsyncWithResult("ls -la")
 * if (result.success) {
 *   console.log(result.stdout)
 * } else {
 *   console.error("Command failed:", result.error)
 *   console.error("stderr:", result.stderr)
 * }
 */
declare const executeCommandAsyncWithResult: (command: string, options?: ExecOptions) => Promise<AsyncCommandResult>;
/**
 * Checks if a command exists asynchronously.
 *
 * @param command - Command name to check (e.g., "git", "node").
 * @returns Promise resolving to true if command exists, false otherwise.
 *
 * @example
 * if (await commandExistsAsync("git")) {
 *   console.log("Git is available")
 * }
 */
declare const commandExistsAsync: (command: string) => Promise<boolean>;
//#endregion
//#region src/fs/directory.d.ts
declare const makeDirectorySync: (directory: string) => void;
declare const makeDirectoryAsync: (directory: string) => Promise<void>;
declare const readDirectorySync: (directoryPath: string) => string[];
declare const removeDirectorySync: (directoryPath: string) => void;
//#endregion
//#region src/fs/error.d.ts
declare const errorCodes: {
  readonly fileNotFound: "ENOENT";
};
declare const putError: (error: unknown) => void;
declare const isNodeError: (error: unknown) => error is NodeJS.ErrnoException;
//#endregion
//#region src/fs/file-io.d.ts
/**
 * Saves text to file asynchronously using atomic write.
 * Atomic write ensures file is not corrupted if process crashes during write.
 * Logs error but doesn't throw on failure.
 */
declare const saveTextFileAsync: (fileName: string, data: string) => Promise<void>;
/**
 * Synchronous version of saveTextFileAsync.
 * Uses atomic write to prevent file corruption.
 */
declare const saveTextFileSync: (fileName: string, data: string) => void;
/**
 * Saves an object as JSON file asynchronously.
 * Uses JSON.stringify with default formatting (no pretty-print).
 */
declare const saveJsonAsync: (fileName: string, data: object) => Promise<void>;
/**
 * Synchronous version of saveJsonAsync.
 * Converts object to JSON string and saves atomically.
 */
declare const saveJson: (fileName: string, data: object) => void;
/**
 * Saves binary data to file synchronously using atomic write.
 * Accepts Buffer for binary data or string for text-based binary formats.
 */
declare const saveBinaryFile: (fileName: string, data: Buffer | string) => void;
/**
 * Saves image data to file.
 * Type-safe wrapper around saveBinaryFile that only accepts Buffer.
 */
declare const saveImage: (fileName: string, data: Buffer) => void;
/**
 * Reads text file synchronously using atomic read operation.
 * Returns undefined if file doesn't exist or read fails.
 * Logs specific error message for missing files.
 */
declare const readTextFileSync: (fileName: string) => string | undefined;
/**
 * Reads and parses JSON file synchronously.
 * Returns undefined if file doesn't exist or JSON is invalid.
 * Logs errors but doesn't throw.
 */
declare const readJsonSync: (fileName: string) => unknown;
/**
 * Async version of readTextFileSync.
 * Reads text file and returns undefined on failure.
 */
declare const readTextFileAsync: (fileName: string) => Promise<string | undefined>;
//#endregion
//#region src/fs/file-ops.d.ts
/**
 * Removes a file. Does nothing if file doesn't exist (force: true).
 */
declare const removeFileSync: (fileName: string) => void;
/**
 * Async version of removeFileSync.
 * Logs error but doesn't throw on failure.
 */
declare const removeFileAsync: (fileName: string) => Promise<void>;
/**
 * Checks if a file exists and is a regular file (not a directory).
 * @returns true if file exists, false otherwise
 */
declare const fileExists: (fileName: string) => boolean;
/**
 * Checks if a file exists and has zero bytes.
 * @returns true if file exists and is empty, false if missing or has content
 */
declare const fileEmpty: (fileName: string) => boolean;
/**
 * Async version of fileExists.
 * Checks if path exists and is a regular file.
 */
declare const fileExistsAsync: (fileName: string) => Promise<boolean>;
//#endregion
//#region src/fs/path.d.ts
/**
 * Changes the file extension of a path.
 * Automatically adds leading dot if not provided.
 * @example changeExtension('/path/to/file.txt', 'md') → '/path/to/file.md'
 * @example changeExtension('/path/to/file.txt', '.json') → '/path/to/file.json'
 */
declare const changeExtension: (filePath: string, extension: string) => string;
/**
 * Appends text to the filename (before extension).
 * Useful for creating variants like 'file-copy.txt' or 'image-thumb.jpg'.
 * @example appendToFileName('/path/to/file.txt', '-copy') → '/path/to/file-copy.txt'
 */
declare const appendToFileName: (filePath: string, suffix: string) => string;
/**
 * Replaces the filename while keeping directory and extension.
 * @example changeFileName('/path/to/file.txt', 'newname') → '/path/to/newname.txt'
 */
declare const changeFileName: (filePath: string, newName: string) => string;
//#endregion
export { appendToFileName, changeExtension, changeFileName, commandExists, commandExistsAsync, errorCodes, executeCommand, executeCommandAsync, executeCommandAsyncWithResult, executeCommandString, executeCommandWithResult, fileEmpty, fileExists, fileExistsAsync, isNodeError, makeDirectoryAsync, makeDirectorySync, putError, readDirectorySync, readJsonSync, readTextFileAsync, readTextFileSync, removeDirectorySync, removeFileAsync, removeFileSync, saveBinaryFile, saveImage, saveJson, saveJsonAsync, saveTextFileAsync, saveTextFileSync };
//# sourceMappingURL=node.d.mts.map