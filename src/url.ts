import { toFiniteNumber } from "@/common"

const minPort = 0 as const
const maxPort = 65_535 as const

const isValidPort = (value: number): boolean => Number.isInteger(value) && value >= minPort && value <= maxPort

export const createUrl = (
    options: {
        host: string
        password?: string
        path?: string
        port?: number | string
        protocol: string
        user?: string
    },
    name?: string,
): URL => {
    const { host, password, path, port, protocol, user } = options

    const baseUrlString = `${protocol}://${host}`
    if (!URL.canParse(baseUrlString)) {
        throw new Error(`Invalid ${name ?? ""} address: ${baseUrlString}`)
    }

    const url = new URL(baseUrlString)

    if (port !== undefined && port !== "") {
        const numericPort = toFiniteNumber(port)
        if (numericPort === undefined || !isValidPort(numericPort)) {
            throw new Error(`Invalid ${name ?? ""} port: ${String(port)}`)
        }
        url.port = String(numericPort)
    }

    if (path !== undefined && path !== "") {
        url.pathname = path
    }

    if (user !== undefined) {
        url.username = user
    }

    if (password !== undefined) {
        url.password = password
    }

    return url
}
