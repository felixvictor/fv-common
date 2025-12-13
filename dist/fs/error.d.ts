declare const errorCodes: {
    readonly fileNotFound: "ENOENT";
};
export declare const putError: (error: unknown) => void;
export declare const isNodeError: (error: unknown) => error is NodeJS.ErrnoException;
export { errorCodes };
//# sourceMappingURL=error.d.ts.map