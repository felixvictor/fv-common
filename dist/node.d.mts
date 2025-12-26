import { ExecOptions, ExecSyncOptions } from "node:child_process";

//#region src/node/command.d.ts
interface AsyncCommandResult {
  error?: Error;
  stderr: string;
  stdout: string;
  success: boolean;
}
interface CommandResult {
  error?: Error;
  output: Buffer | undefined;
  success: boolean;
}
declare const executeCommand: (command: string, options?: ExecSyncOptions) => Buffer;
declare const executeCommandWithResult: (command: string, options?: ExecSyncOptions) => CommandResult;
declare const executeCommandString: (command: string, options?: ExecSyncOptions) => string;
declare const commandExists: (command: string) => boolean;
declare const executeCommandAsync: (command: string, options?: ExecOptions) => Promise<string>;
declare const executeCommandAsyncWithResult: (command: string, options?: ExecOptions) => Promise<AsyncCommandResult>;
declare const commandExistsAsync: (command: string) => Promise<boolean>;
//#endregion
//#region src/node/error.d.ts
declare const errorCodes: {
  readonly fileNotFound: "ENOENT";
};
declare const putError: (error: unknown) => void;
declare const isNodeError: (error: unknown) => error is NodeJS.ErrnoException;
//#endregion
//#region src/node/fs/directory.d.ts
declare const makeDirectorySync: (directory: string) => void;
declare const makeDirectoryAsync: (directory: string) => Promise<void>;
declare const readDirectorySync: (directoryPath: string) => string[];
declare const removeDirectorySync: (directoryPath: string) => void;
//#endregion
//#region src/node/fs/file-io.d.ts
declare const saveTextFileAsync: (fileName: string, data: string) => Promise<void>;
declare const saveTextFileSync: (fileName: string, data: string) => void;
declare const saveJsonAsync: (fileName: string, data: object) => Promise<void>;
declare const saveJson: (fileName: string, data: object) => void;
declare const saveBinaryFile: (fileName: string, data: Buffer | string) => void;
declare const saveImage: (fileName: string, data: Buffer) => void;
declare const readTextFileSync: (fileName: string) => string | undefined;
declare const readJsonSync: (fileName: string) => unknown;
declare const readTextFileAsync: (fileName: string) => Promise<string | undefined>;
//#endregion
//#region src/node/fs/file-ops.d.ts
declare const removeFileSync: (fileName: string) => void;
declare const removeFileAsync: (fileName: string) => Promise<void>;
declare const fileExists: (fileName: string) => boolean;
declare const fileEmpty: (fileName: string) => boolean;
declare const fileExistsAsync: (fileName: string) => Promise<boolean>;
//#endregion
//#region src/node/fs/path.d.ts
declare const changeExtension: (filePath: string, extension: string) => string;
declare const appendToFileName: (filePath: string, suffix: string) => string;
declare const changeFileName: (filePath: string, newName: string) => string;
//#endregion
export { appendToFileName, changeExtension, changeFileName, commandExists, commandExistsAsync, errorCodes, executeCommand, executeCommandAsync, executeCommandAsyncWithResult, executeCommandString, executeCommandWithResult, fileEmpty, fileExists, fileExistsAsync, isNodeError, makeDirectoryAsync, makeDirectorySync, putError, readDirectorySync, readJsonSync, readTextFileAsync, readTextFileSync, removeDirectorySync, removeFileAsync, removeFileSync, saveBinaryFile, saveImage, saveJson, saveJsonAsync, saveTextFileAsync, saveTextFileSync };
//# sourceMappingURL=node.d.mts.map