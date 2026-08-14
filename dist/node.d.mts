import { ExecSyncOptions } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
//#region src/result.d.ts
interface Err<E> {
  readonly error: E;
  readonly ok: false;
}
interface Ok<T> {
  readonly ok: true;
  readonly value: T;
}
type Result<T, E> = Err<E> | Ok<T>;
//#endregion
//#region src/node/command.d.ts
interface CommandError {
  readonly cause: unknown;
  readonly command: string;
  readonly stderr?: string;
}
declare const executeCommand: (command: string, options?: ExecSyncOptions) => Result<string, CommandError>;
declare const executeCommandString: (command: string, options?: ExecSyncOptions) => Result<string, CommandError>;
declare const doesCommandExist: (command: string) => boolean;
declare const executeCommandAsync: (command: string, options?: ExecSyncOptions) => Promise<Result<string, CommandError>>;
declare const commandExistsAsync: (command: string) => Promise<boolean>;
//#endregion
//#region src/node/error.d.ts
declare const errorCodes: {
  readonly addressInUse: "EADDRINUSE";
  readonly brokenPipe: "EPIPE";
  readonly connectionRefused: "ECONNREFUSED";
  readonly directoryNotEmpty: "ENOTEMPTY";
  readonly fileExists: "EEXIST";
  readonly fileNotFound: "ENOENT";
  readonly invalidArgument: "EINVAL";
  readonly noSpaceLeft: "ENOSPC";
  readonly operationNotPermitted: "EPERM";
  readonly permissionDenied: "EACCES";
  readonly readOnlyFileSystem: "EROFS";
  readonly timeout: "ETIMEDOUT";
  readonly tooManyOpenFiles: "EMFILE";
};
type FileSystemError = {
  readonly cause: unknown;
  readonly kind: "unknown";
  readonly path: string;
} | {
  readonly kind: "not-found";
  readonly path: string;
};
interface JsonParseError {
  readonly cause: unknown;
  readonly kind: "parse-error";
  readonly path: string;
}
declare const isNodeError: (error: unknown) => error is NodeJS.ErrnoException;
declare const toFileSystemError: (error: unknown, path: string) => FileSystemError;
//#endregion
//#region src/node/fs/compare.d.ts
declare const isFileOlderThan: (filePathA: string, filePathB: string) => boolean;
declare const isFileOlderThanAsync: (filePathA: string, filePathB: string) => Promise<boolean>;
//#endregion
//#region src/node/fs/constants.d.ts
declare const defaultEncoding: "utf8";
//#endregion
//#region src/node/fs/directory.d.ts
declare const makeDirectorySync: (directory: string) => Result<void, FileSystemError>;
declare const makeDirectoryAsync: (directory: string) => Promise<Result<void, FileSystemError>>;
declare const readDirectorySync: (directoryPath: string) => Result<string[], FileSystemError>;
declare const readDirectoryEntriesSync: (directoryPath: string) => Result<fs.Dirent[], FileSystemError>;
declare const readDirectoryAsync: (directoryPath: string) => Promise<Result<string[], FileSystemError>>;
declare const readDirectoryEntriesAsync: (directoryPath: string) => Promise<Result<fs.Dirent[], FileSystemError>>;
declare const readDirectoryNotRecursive: (directoryPath: string) => Result<string[], FileSystemError>;
declare const readDirectoryNotRecursiveAsync: (directoryPath: string) => Promise<Result<string[], FileSystemError>>;
declare const removeDirectorySync: (directoryPath: string) => Result<void, FileSystemError>;
declare const removeDirectoryAsync: (directoryPath: string) => Promise<Result<void, FileSystemError>>;
declare const doesDirectoryExist: (directoryPath: string) => boolean;
declare const doesDirectoryExistAsync: (directoryPath: string) => Promise<boolean>;
//#endregion
//#region src/node/fs/file-io.d.ts
declare const readTextFileSync: (fileName: string) => Result<string, FileSystemError>;
declare const readTextFileAsync: (fileName: string) => Promise<Result<string, FileSystemError>>;
declare const saveTextFileSync: (fileName: string, data: string) => Result<void, FileSystemError>;
declare const saveTextFileAsync: (fileName: string, data: string) => Promise<Result<void, FileSystemError>>;
declare const readJsonSync: (fileName: string) => Result<unknown, FileSystemError | JsonParseError>;
declare const readJsonAsync: (fileName: string) => Promise<Result<unknown, FileSystemError | JsonParseError>>;
declare const saveJsonSync: (fileName: string, data: object) => Result<void, FileSystemError>;
declare const saveJsonAsync: (fileName: string, data: object) => Promise<Result<void, FileSystemError>>;
declare const readBinaryFileSync: (fileName: string) => Result<Buffer, FileSystemError>;
declare const readBinaryFileAsync: (fileName: string) => Promise<Result<Buffer, FileSystemError>>;
declare const saveBinaryFileSync: (fileName: string, data: Buffer | string) => Result<void, FileSystemError>;
declare const saveBinaryFileAsync: (fileName: string, data: Buffer | string) => Promise<Result<void, FileSystemError>>;
declare const readImageSync: (fileName: string) => Result<Buffer, FileSystemError>;
declare const readImageAsync: (fileName: string) => Promise<Result<Buffer, FileSystemError>>;
declare const saveImageSync: (fileName: string, data: Buffer) => Result<void, FileSystemError>;
declare const saveImageAsync: (fileName: string, data: Buffer) => Promise<Result<void, FileSystemError>>;
//#endregion
//#region src/node/fs/file-ops.d.ts
declare const removeFileSync: (fileName: string) => Result<void, FileSystemError>;
declare const removeFileAsync: (fileName: string) => Promise<Result<void, FileSystemError>>;
declare const doesFileExist: (fileName: string) => boolean;
declare const isFileEmpty: (fileName: string) => boolean;
declare const doesFileExistAsync: (fileName: string) => Promise<boolean>;
declare const getFileSize: (fileName: string) => number | undefined;
//#endregion
//#region src/node/fs/fs.d.ts
declare const getFreeSpace: (directory: string) => number | undefined;
declare const getFreeSpaceAsync: (directory: string) => Promise<number | undefined>;
declare const getTotalSpace: (directory: string) => number | undefined;
declare const getTotalSpaceAsync: (directory: string) => Promise<number | undefined>;
declare const getUsedSpace: (directory: string) => number | undefined;
declare const getUsedSpaceAsync: (directory: string) => Promise<number | undefined>;
declare const getDiskUsage: (directory: string) => undefined | {
  free: number;
  percentUsed: number;
  total: number;
  used: number;
};
declare const getDiskUsageAsync: (directory: string) => Promise<undefined | {
  free: number;
  percentUsed: number;
  total: number;
  used: number;
}>;
//#endregion
//#region src/node/fs/path.d.ts
declare const changeExtension: (filePath: string, extension: string) => string;
declare const removeExtension: (filePath: string) => string;
declare const getExtension: (filePath: string) => string;
declare const appendToFileName: (filePath: string, suffix: string) => string;
declare const prependToFileName: (filePath: string, prefix: string) => string;
declare const changeFileName: (filePath: string, newName: string) => string;
declare const getFileName: (filePath: string) => string;
declare const getFileNameWithExtension: (filePath: string) => string;
declare const getFullPath: (parsedPath: path.ParsedPath) => string;
declare const getDirectory: (filePath: string) => string;
declare const joinPaths: (path1: string, path2: string) => string;
//#endregion
//#region src/node/fs/stat.d.ts
declare const getStatSync: (path: string) => Result<fs.Stats, FileSystemError>;
declare const getStatAsync: (path: string) => Promise<Result<fs.Stats, FileSystemError>>;
declare const doesPathExist: (path: string) => boolean;
declare const doesPathExistAsync: (path: string) => Promise<boolean>;
//#endregion
export { type CommandError, type FileSystemError, type JsonParseError, appendToFileName, changeExtension, changeFileName, commandExistsAsync, defaultEncoding, doesCommandExist, doesDirectoryExist, doesDirectoryExistAsync, doesFileExist, doesFileExistAsync, doesPathExist, doesPathExistAsync, errorCodes, executeCommand, executeCommandAsync, executeCommandString, getDirectory, getDiskUsage, getDiskUsageAsync, getExtension, getFileName, getFileNameWithExtension, getFileSize, getFreeSpace, getFreeSpaceAsync, getFullPath, getStatAsync, getStatSync, getTotalSpace, getTotalSpaceAsync, getUsedSpace, getUsedSpaceAsync, isFileEmpty, isFileOlderThan, isFileOlderThanAsync, isNodeError, joinPaths, makeDirectoryAsync, makeDirectorySync, prependToFileName, readBinaryFileAsync, readBinaryFileSync, readDirectoryAsync, readDirectoryEntriesAsync, readDirectoryEntriesSync, readDirectoryNotRecursive, readDirectoryNotRecursiveAsync, readDirectorySync, readImageAsync, readImageSync, readJsonAsync, readJsonSync, readTextFileAsync, readTextFileSync, removeDirectoryAsync, removeDirectorySync, removeExtension, removeFileAsync, removeFileSync, saveBinaryFileAsync, saveBinaryFileSync, saveImageAsync, saveImageSync, saveJsonAsync, saveJsonSync, saveTextFileAsync, saveTextFileSync, toFileSystemError };
//# sourceMappingURL=node.d.mts.map