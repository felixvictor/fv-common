const errorCodes = {
    fileNotFound: "ENOENT",
} as const

export const putError = (error: unknown): void => {
    const message = error instanceof Error ? error.message : String(error)
    console.error("Request failed -->", message)
}

export const isNodeError = (error: unknown): error is NodeJS.ErrnoException => error instanceof Error && "code" in error

export { errorCodes }
