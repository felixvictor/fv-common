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
export declare const executeCommand: (command: string, options?: ExecSyncOptions) => Result<string, CommandError>;
export declare const executeCommandString: (command: string, options?: ExecSyncOptions) => Result<string, CommandError>;
export declare const doesCommandExist: (command: string) => boolean;
export declare const executeCommandAsync: (command: string, options?: ExecSyncOptions) => Promise<Result<string, CommandError>>;
export declare const commandExistsAsync: (command: string) => Promise<boolean>;
//#endregion
//#region src/node/error.d.ts
export declare const errorCodes: {
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
export declare const isNodeError: (error: unknown) => error is NodeJS.ErrnoException;
export declare const toFileSystemError: (error: unknown, path: string) => FileSystemError;
//#endregion
//#region src/node/fs/compare.d.ts
export declare const isFileOlderThan: (filePathA: string, filePathB: string) => boolean;
export declare const isFileOlderThanAsync: (filePathA: string, filePathB: string) => Promise<boolean>;
//#endregion
//#region src/node/fs/constants.d.ts
export declare const defaultEncoding: "utf8";
//#endregion
//#region src/node/fs/directory.d.ts
export declare const makeDirectorySync: (directory: string) => Result<void, FileSystemError>;
export declare const makeDirectoryAsync: (directory: string) => Promise<Result<void, FileSystemError>>;
export declare const readDirectorySync: (directoryPath: string) => Result<string[], FileSystemError>;
export declare const readDirectoryEntriesSync: (directoryPath: string) => Result<fs.Dirent[], FileSystemError>;
export declare const readDirectoryAsync: (directoryPath: string) => Promise<Result<string[], FileSystemError>>;
export declare const readDirectoryEntriesAsync: (directoryPath: string) => Promise<Result<fs.Dirent[], FileSystemError>>;
export declare const readDirectoryNotRecursive: (directoryPath: string) => Result<string[], FileSystemError>;
export declare const readDirectoryNotRecursiveAsync: (directoryPath: string) => Promise<Result<string[], FileSystemError>>;
export declare const removeDirectorySync: (directoryPath: string) => Result<void, FileSystemError>;
export declare const removeDirectoryAsync: (directoryPath: string) => Promise<Result<void, FileSystemError>>;
export declare const emptyDirectorySync: (directoryPath: string) => Result<void, FileSystemError>;
export declare const emptyDirectoryAsync: (directoryPath: string) => Promise<Result<void, FileSystemError>>;
export declare const doesDirectoryExist: (directoryPath: string) => boolean;
export declare const doesDirectoryExistAsync: (directoryPath: string) => Promise<boolean>;
//#endregion
//#region src/node/fs/file-io.d.ts
export declare const readTextFileSync: (fileName: string) => Result<string, FileSystemError>;
export declare const readTextFileAsync: (fileName: string) => Promise<Result<string, FileSystemError>>;
export declare const saveTextFileSync: (fileName: string, data: string) => Result<void, FileSystemError>;
export declare const saveTextFileAsync: (fileName: string, data: string) => Promise<Result<void, FileSystemError>>;
export declare const readJsonSync: (fileName: string) => Result<unknown, FileSystemError | JsonParseError>;
export declare const readJsonAsync: (fileName: string) => Promise<Result<unknown, FileSystemError | JsonParseError>>;
export declare const saveJsonSync: (fileName: string, data: object) => Result<void, FileSystemError>;
export declare const saveJsonAsync: (fileName: string, data: object) => Promise<Result<void, FileSystemError>>;
export declare const readBinaryFileSync: (fileName: string) => Result<Buffer, FileSystemError>;
export declare const readBinaryFileAsync: (fileName: string) => Promise<Result<Buffer, FileSystemError>>;
export declare const saveBinaryFileSync: (fileName: string, data: Buffer | string) => Result<void, FileSystemError>;
export declare const saveBinaryFileAsync: (fileName: string, data: Buffer | string) => Promise<Result<void, FileSystemError>>;
export declare const readImageSync: (fileName: string) => Result<Buffer, FileSystemError>;
export declare const readImageAsync: (fileName: string) => Promise<Result<Buffer, FileSystemError>>;
export declare const saveImageSync: (fileName: string, data: Buffer) => Result<void, FileSystemError>;
export declare const saveImageAsync: (fileName: string, data: Buffer) => Promise<Result<void, FileSystemError>>;
//#endregion
//#region src/node/fs/file-ops.d.ts
export declare const removeFileSync: (fileName: string) => Result<void, FileSystemError>;
export declare const removeFileAsync: (fileName: string) => Promise<Result<void, FileSystemError>>;
export declare const doesFileExist: (fileName: string) => boolean;
export declare const isFileEmpty: (fileName: string) => boolean;
export declare const doesFileExistAsync: (fileName: string) => Promise<boolean>;
export declare const getFileSize: (fileName: string) => number | undefined;
//#endregion
//#region src/node/fs/fs.d.ts
export declare const getFreeSpace: (directory: string) => number | undefined;
export declare const getFreeSpaceAsync: (directory: string) => Promise<number | undefined>;
export declare const getTotalSpace: (directory: string) => number | undefined;
export declare const getTotalSpaceAsync: (directory: string) => Promise<number | undefined>;
export declare const getUsedSpace: (directory: string) => number | undefined;
export declare const getUsedSpaceAsync: (directory: string) => Promise<number | undefined>;
export declare const getDiskUsage: (directory: string) => undefined | {
  free: number;
  percentUsed: number;
  total: number;
  used: number;
};
export declare const getDiskUsageAsync: (directory: string) => Promise<undefined | {
  free: number;
  percentUsed: number;
  total: number;
  used: number;
}>;
//#endregion
//#region src/node/fs/path.d.ts
export declare const changeExtension: (filePath: string, extension: string) => string;
export declare const removeExtension: (filePath: string) => string;
export declare const getExtension: (filePath: string) => string;
export declare const appendToFileName: (filePath: string, suffix: string) => string;
export declare const prependToFileName: (filePath: string, prefix: string) => string;
export declare const changeFileName: (filePath: string, newName: string) => string;
export declare const getFileName: (filePath: string) => string;
export declare const getFileNameWithExtension: (filePath: string) => string;
export declare const getFullPath: (parsedPath: path.ParsedPath) => string;
export declare const getDirectory: (filePath: string) => string;
export declare const joinPaths: (path1: string, path2: string) => string;
//#endregion
//#region src/node/fs/stat.d.ts
export declare const getStatSync: (path: string) => Result<fs.Stats, FileSystemError>;
export declare const getStatAsync: (path: string) => Promise<Result<fs.Stats, FileSystemError>>;
export declare const doesPathExist: (path: string) => boolean;
export declare const doesPathExistAsync: (path: string) => Promise<boolean>;
//#endregion
export type { CommandError, FileSystemError, JsonParseError };
//# sourceMappingURL=node.d.mts.map