/** Models a recoverable failure as a value, so a caller must handle it explicitly instead of it being swallowed. */

export interface Err<E> {
    readonly error: E
    readonly ok: false
}

export interface Ok<T> {
    readonly ok: true
    readonly value: T
}

export type Result<T, E> = Err<E> | Ok<T>

/** Chains a fallible operation onto a success value (a.k.a. `flatMap`/`bind`). */
export function andThen<T, U, E>(result: Result<T, E>, next: (value: T) => Result<U, E>): Result<U, E> {
    return isOk(result) ? next(result.value) : result
}

export function err<E>(error: E): Err<E> {
    return { error, ok: false }
}

export function isErr<T, E>(result: Result<T, E>): result is Err<E> {
    return !result.ok
}

export function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
    return result.ok
}

export function ok<T>(value: T): Ok<T> {
    return { ok: true, value }
}

/** Returns the success value, or `fallback` if the result is an `Err`. */
export function unwrapOr<T, E>(result: Result<T, E>, fallback: T): T {
    return isOk(result) ? result.value : fallback
}

/** Returns the success value, or throws. `message` becomes the thrown `Error`'s message, `error` its `cause`. */
export function unwrapOrThrow<T, E>(result: Result<T, E>, message: string): T {
    if (isErr(result)) {
        throw new Error(message, { cause: result.error })
    }
    return result.value
}
