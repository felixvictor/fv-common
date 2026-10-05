//#region src/result.d.ts
interface Err<E> {
  readonly error: E;
  readonly ok: false;
}
interface Ok<T> {
  readonly ok: true;
  readonly value: T;
}
type Result<T, E> = Err<E> | Ok<T>;
declare function andThen<T, U, E>(result: Result<T, E>, next: (value: T) => Result<U, E>): Result<U, E>;
declare function err<E>(error: E): Err<E>;
declare function isErr<T, E>(result: Result<T, E>): result is Err<E>;
declare function isOk<T, E>(result: Result<T, E>): result is Ok<T>;
declare function ok<T>(value: T): Ok<T>;
declare function unwrapOr<T, E>(result: Result<T, E>, fallback: T): T;
declare function unwrapOrThrow<T, E>(result: Result<T, E>, message: string): T;
//#endregion
export { err as a, ok as c, andThen as i, unwrapOr as l, Ok as n, isErr as o, Result as r, isOk as s, Err as t, unwrapOrThrow as u };
//# sourceMappingURL=result-SaC_idVt.d.ts.map