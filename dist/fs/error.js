const errorCodes = {
    fileNotFound: "ENOENT",
};
export const putError = (error) => {
    const message = error instanceof Error ? error.message : String(error);
    console.error("Request failed -->", message);
};
export const isNodeError = (error) => error instanceof Error && "code" in error;
export { errorCodes };
//# sourceMappingURL=error.js.map