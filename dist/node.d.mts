import { ExecSyncOptions } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

//#region src/node/command.d.ts
interface AsyncCommandResult {
  error?: Error;
  stderr: string;
  stdout: string;
  success: boolean;
}
interface CommandResult {
  error?: Error;
  output: string | undefined;
  success: boolean;
}
declare const executeCommand: (command: string, options?: ExecSyncOptions) => string;
declare const executeCommandWithResult: (command: string, options?: ExecSyncOptions) => CommandResult;
declare const executeCommandString: (command: string, options?: ExecSyncOptions) => string;
declare const commandExists: (command: string) => boolean;
declare const executeCommandAsync: (command: string, options?: ExecSyncOptions) => Promise<string>;
declare const executeCommandAsyncWithResult: (command: string, options?: ExecSyncOptions) => Promise<AsyncCommandResult>;
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
declare const putError: (error: unknown) => void;
declare const isNodeError: (error: unknown) => error is NodeJS.ErrnoException;
//#endregion
//#region src/node/fs/constants.d.ts
declare const defaultEncoding: "utf8";
//#endregion
//#region src/node/fs/directory.d.ts
declare const makeDirectorySync: (directory: string) => void;
declare const makeDirectoryAsync: (directory: string) => Promise<void>;
declare const readDirectorySync: (directoryPath: string) => string[];
declare const readDirectoryAsync: (directoryPath: string) => Promise<string[]>;
declare const readDirectoryNotRecursive: (directoryPath: string) => string[];
declare const readDirectoryNotRecursiveAsync: (directoryPath: string) => Promise<string[]>;
declare const removeDirectorySync: (directoryPath: string) => void;
declare const removeDirectoryAsync: (directoryPath: string) => Promise<void>;
declare const directoryExists: (directoryPath: string) => boolean;
declare const directoryExistsAsync: (directoryPath: string) => Promise<boolean>;
//#endregion
//#region src/node/fs/file-io.d.ts
declare const readTextFileSync: (fileName: string) => string | undefined;
declare const readTextFileAsync: (fileName: string) => Promise<string | undefined>;
declare const saveTextFileSync: (fileName: string, data: string) => void;
declare const saveTextFileAsync: (fileName: string, data: string) => Promise<void>;
declare const readJsonSync: (fileName: string) => unknown;
declare const readJsonAsync: (fileName: string) => Promise<unknown>;
declare const saveJsonSync: (fileName: string, data: object) => void;
declare const saveJsonAsync: (fileName: string, data: object) => Promise<void>;
declare const readBinaryFileSync: (fileName: string) => Buffer | undefined;
declare const readBinaryFileAsync: (fileName: string) => Promise<Buffer | undefined>;
declare const saveBinaryFileSync: (fileName: string, data: Buffer | string) => void;
declare const saveBinaryFileAsync: (fileName: string, data: Buffer | string) => Promise<void>;
declare const readImageSync: (fileName: string) => Buffer | undefined;
declare const readImageAsync: (fileName: string) => Promise<Buffer | undefined>;
declare const saveImageSync: (fileName: string, data: Buffer) => void;
declare const saveImageAsync: (fileName: string, data: Buffer) => Promise<void>;
//#endregion
//#region src/node/fs/file-ops.d.ts
declare const removeFileSync: (fileName: string) => void;
declare const removeFileAsync: (fileName: string) => Promise<void>;
declare const fileExists: (fileName: string) => boolean;
declare const fileEmpty: (fileName: string) => boolean;
declare const fileExistsAsync: (fileName: string) => Promise<boolean>;
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
//#endregion
//#region src/node/fs/stat.d.ts
declare const getStatSync: (path: string) => fs.Stats | undefined;
declare const getStatAsync: (path: string) => Promise<fs.Stats | undefined>;
declare const pathExists: (path: string) => boolean;
declare const pathExistsAsync: (path: string) => Promise<boolean>;
//#endregion
export { appendToFileName, changeExtension, changeFileName, commandExists, commandExistsAsync, defaultEncoding, directoryExists, directoryExistsAsync, errorCodes, executeCommand, executeCommandAsync, executeCommandAsyncWithResult, executeCommandString, executeCommandWithResult, fileEmpty, fileExists, fileExistsAsync, getDirectory, getDiskUsage, getDiskUsageAsync, getExtension, getFileName, getFileNameWithExtension, getFileSize, getFreeSpace, getFreeSpaceAsync, getFullPath, getStatAsync, getStatSync, getTotalSpace, getTotalSpaceAsync, getUsedSpace, getUsedSpaceAsync, isNodeError, makeDirectoryAsync, makeDirectorySync, pathExists, pathExistsAsync, prependToFileName, putError, readBinaryFileAsync, readBinaryFileSync, readDirectoryAsync, readDirectoryNotRecursive, readDirectoryNotRecursiveAsync, readDirectorySync, readImageAsync, readImageSync, readJsonAsync, readJsonSync, readTextFileAsync, readTextFileSync, removeDirectoryAsync, removeDirectorySync, removeExtension, removeFileAsync, removeFileSync, saveBinaryFileAsync, saveBinaryFileSync, saveImageAsync, saveImageSync, saveJsonAsync, saveJsonSync, saveTextFileAsync, saveTextFileSync };
//# sourceMappingURL=node.d.mts.map