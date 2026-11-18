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

/**
 * Fetches `path` and parses the response body as JSON. `init` is passed to `fetch` unchanged, e.g. for request headers
 * or `AbortSignal.timeout()`.
 *
 * Rejects if the request fails or is aborted, if the response status is not 2xx (the error message names URL and
 * status), or if the body is not valid JSON. `T` is not checked at runtime: for untrusted sources, keep the default
 * `unknown` and narrow the result with type guards.
 */
export const loadFile = async <T = unknown>(path: string, init?: RequestInit): Promise<T> => {
    const response = await fetch(path, init)

    if (!response.ok) {
        throw new FetchError(response)
    }

    return (await response.json()) as Promise<T>
}
