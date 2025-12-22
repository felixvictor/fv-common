class FetchError extends Error {
    get response(): Response {
        return this.#response
    }

    get status(): number {
        return this.#response.status
    }

    get statusText(): string {
        return this.#response.statusText
    }

    get url(): string {
        return this.#response.url
    }

    readonly #response: Response

    constructor(response: Response) {
        super(`${response.url} ${response.statusText} (status ${response.status})`)
        this.name = "FetchError"
        this.#response = response
    }
}

export const loadFile = async <T = unknown>(path: string): Promise<T> => {
    const response = await fetch(path)

    if (!response.ok) {
        throw new FetchError(response)
    }

    return (await response.json()) as Promise<T>
}
