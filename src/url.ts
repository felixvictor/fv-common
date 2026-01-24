export const createUrl = (
    options: { host: string; path?: string; port?: number | string; protocol: string },
    name?: string,
): URL => {
    const { host, path, port, protocol } = options

    let urlString = `${protocol}://${host}`

    if (port) {
        urlString += `:${port}`
    }

    if (path) {
        const normalizedPath = path.startsWith("/") ? path : `/${path}`
        urlString += normalizedPath
    }

    if (!URL.canParse(urlString)) {
        throw new Error(`Invalid ${name ?? ""} address: ${urlString}`)
    }

    return new URL(urlString)
}
